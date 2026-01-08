---
title: Methods Under SNI Censorship and Fake Wall Attack Analysis
tags:
  - GFW
  - Firewall
cover: https://s2.ixacg.com/2025/04/10/1744271881.avif
createTime: 2026/01/06 11:47:22
permalink: /en/blog/7kahi02q/
excerpt: Hypertext Transfer Protocol, the various web pages we browse daily are transmitted via HTTP protocol, but its transmission process is not encrypted and is insecure.
---

> ## Introduction to Some Technical Terms

**HTTP (Hyper Text Transfer Protocol)**

Hypertext Transfer Protocol, the various web pages we browse daily are transmitted via HTTP protocol, but its transmission process is not encrypted and is insecure.
Currently, supporting HTTP generally means that both HTTP and HTTPS functions can be implemented, not just HTTP alone.

**TLS (Transport Layer Security)**

Transport Layer Security, its predecessor is SSL. It implements the function of encrypting messages before handing them over to TCP for transmission. That is, HTTP + TLS = HTTPS

**SNI (Server Name Indication)**

Server Name Indication. SNI is an extension of SSL/TLS to solve the problem of one server using multiple domains and certificates. It allows servers to support multiple certificates on the same IP address and TCP port, thereby allowing multiple HTTPS or other services on TLS websites to request different services under the same IP address.

Simply put, it's a method for deploying different certificates on the same port of a server. The server handles requests based on the SNI domain name in the received request. If the SNI domain is empty, it handles requests according to the pre-set default domain.

**CDN (Content Delivery Network)**

Content Delivery Network, a high-speed network topology formed by servers deployed in various regions together, allowing users to achieve fast access in every region. CDN responds to different websites through SNI while also protecting the security of the origin server.

**Nginx**

A mainstream high-performance open-source HTTP reverse proxy tool, mainly used for reverse proxy, load balancing, and static/dynamic resource separation.

**Reverse Proxy**

Deploying an outer server in front of the origin server as a gateway. Users can only access the outer server, thereby protecting the internal network server from being exposed. As a gateway, it can also analyze and modify messages.

When the proxy server and origin server are deployed on the same host, it's called local reverse proxy.

> ## Current Mainstream Blocking Technologies

Here's a brief overview of the technologies. For more details, please [search on Baidu](https://en.wikipedia.org/wiki/Great_Firewall)

In current life, GFW mainly uses two methods to block violating websites: 1. DNS pollution, 2. TCP reset attack.

**DNS Pollution**

Mainly checks keywords in HTTP messages to intercept content on corresponding websites. When browsing, you'll see an `ERR_CONNECTION_TIMED_OUT` error because DNS will be pointed to an inaccessible address, causing access timeout. DNS queries can reach the DNS server, but if they match forbidden keywords, \*\*the firewall will inject fake DNS replies before legitimate DNS replies. The solution is to do local resolution by modifying the local Hosts file for direct IP connection.

However, in current life, DNS pollution methods are rarely seen in blocking major websites, mainly because HTTPS encrypts browsing content, making the keyword detection in messages ineffective.

**SNI Censorship Method**

Under normal circumstances, TLS handshake requires the following stages:

![Figure 1](https://s2.ixacg.com/2025/04/10/1744271903.avif)

In the initial Client Hello phase, both parties haven't agreed on the encryption method yet, so the message is in plaintext. The Extension field contains SNI information, which is the domain currently being requested, and this information can be obtained through packet capture.

Under normal circumstances, the server sends the corresponding domain certificate to the client based on the domain contained in SNI, proceeding with subsequent handshake steps. After negotiation ends, encrypted communication begins.

However, in this process, GFW can judge the legitimacy of the website the client is requesting by intercepting the domain in SNI, and perform detection and blocking. The blocking method is [TCP reset attack](https://www.cnblogs.com/ryanyangcs/p/13152036.html). This technique is called SNI blocking based on deep packet inspection.

TCP reset attack is executed with a single packet. The attacker crafts and sends a forged TCP reset packet to interfere with the connection between the user and website, tricking both parties to terminate the TCP connection.
Currently, GFW preemptively sends RST packets to interrupt such connections. This technique is also called TCP keyword blocking.

> ## A Feasible Solution

SNI is a method for deploying different certificates on the same port of a server. The certificates provided by Cloudflare after enabling CDN are deployed based on SNI. One important process for implementing SNI is sending the domain to connect to when establishing the connection between client and server, so the server can return a certificate issued to the specified domain.

In this process, if a user requests a non-existent domain, the server sends a default certificate to the client so the connection can continue.

This method of bypassing blocking by obfuscating Server Name is called **Domain Fronting**. Simply put, it means not carrying SNI or carrying invalid SNI in the Client Hello phase, hiding the real connection website to circumvent internet censorship.

Currently effective for large websites like Steam, Pixiv, Github, etc.

**How Domain Fronting Works**

Users use a legitimate domain to request CDN IP from DNS, then initiate a request to CDN. Because when processing HTTPS requests, CDN first decrypts it and forwards the request based on the HTTP Host value. So if users want to access an illegal website, they can use a legitimate domain on CDN as SNI, then use it as HTTP Host to communicate with CDN via HTTPS. Since HTTP Host can only be seen by the forwarder and censors cannot see it, CDN will let this request pass and re-encapsulate the HTTP request based on HTTP Host, sending it to the actually requested server. In this case, the client is actually communicating with an illegal website, but to traffic monitoring equipment, the client appears to be communicating with a legitimate website, i.e., the client successfully disguised traffic as legitimate communication traffic.

![Figure 2](https://s2.ixacg.com/2025/04/10/1744271919.avif)

This method is relatively feasible when the blocked site and harmless site are from the same large service provider, such as services provided by content delivery networks. In this case, censors usually have difficulty distinguishing the characteristics of disguised traffic from legitimate traffic, forcing censors to choose to pass all seemingly harmless traffic or completely block all traffic in this domain. Complete blocking may cause significant collateral damage.

---

> ## Complete Solutions for Fake Wall (Pseudo Wall) Attacks

**1. What is a Fake Wall Attack?**

A fake wall attack refers to a way of attacking websites by exploiting GFW's functions.

Hackers set up a server A in China and a server B abroad. Then by modifying server A's hosts file, they point the target website like www.xxx.com to server B, then create illegal content websites on server B and bind the domain www.xxx.com.

This way, accessing www.xxx.com through server A will "incorrectly" redirect to the illegal website set up by hackers, not the correct server set up by www.xxx.com.

Then hackers use packet sending software on server A to send a large number of requests containing illegal keywords to the www.xxx.com website. This way, with both illegal requests and actual access to illegal results, GFW will temporarily block www.xxx.com through TCP blocking. If hackers continue this packet attack, the website will be repeatedly temporarily banned, resulting in long-term inaccessibility.

**2. How to Determine if You're Under Fake Wall Attack?**

If your website frequently or for long periods cannot be accessed, and inspection reveals that domain resolution is normal, WEB service is normal, overseas access is normal, the domain is not blocked or polluted, but server ports 80 and 443 are inaccessible, then you're basically under fake wall attack.

Detection URLs: https://www.boce.com and https://support.dnspod.cn

Use the former to check domestic access and whether the domain is blocked or hijacked, whether DNS is polluted. Use the latter to check if port 80 and 443 services are normal.

**3. How to Solve Fake Wall Attacks?**

This site has found the following three solutions through practice:

**Solution 1: Domain ICP filing and use domestic servers.**

Since fake wall attacks exploit GFW functions, the most effective method is to file the attacked domain and use domestic servers, because GFW is designed to target websites with servers abroad.

Advantages: Once and for all, absolutely effective.

Disadvantages: Filing takes a long time, especially since websites targeted by fake wall attacks often have some violations that may prevent filing.

**Solution 2: Smart DNS resolution + multiple IP servers.**

This solution requires a large number of IPs, at least 100+, and a DNS that supports API. Using Alibaba Cloud Enterprise DNS as an example, solutions can be subdivided into two:

One is cycling through API resolution, setting to switch IP every minute.

Two is using Alibaba Cloud's global traffic management feature, setting multiple resolution IP pools, checking each resolution IP every minute. If an IP is inaccessible, smartly switch to other working IPs for resolution.

This effectively solves the fake wall problem because there are many IPs that exceed the wall's speed.

Advantages: Fully controllable, fate in your own hands, suitable for webmasters who like to tinker.

Disadvantages: Higher cost, DNS and many IPs all cost money. Also quite technically demanding because you need to develop code to call APIs or set up global traffic management and smart resolution features. Also affected by DNS server cache times in various regions, some users will inevitably still be affected.

**Solution 3: Use anti-fake-wall CDN.**

Where there's demand, there's a market. Currently there are some CDN service providers on the market that offer anti-fake-wall functions.
