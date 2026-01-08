---
title: Linux Bypass CF and Scrape Hanime Videos
tags:
  - Python
  - Linux
cover: https://s2.ixacg.com/2025/04/10/1744271725.avif
abbrlink: 24644
createTime: 2026/01/06 11:47:22
permalink: /en/blog/6g6qjjjo/
---

# Bypass Cloudflare Shield

Use cloudscraper instead of requests

<!-- more -->

```python
pip3 install cloudscraper
```

```python
import cloudscraper
scraper = cloudscraper.create_scraper()
response =scraper.get(url)
```

# Scrape Dynamic Web Content, Need to Install Selenium

```python
pip3 install selenium
```

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
url = "xxxx"
chrome_options = Options()
chrome_options.add_argument('--no-sandbox')  # Grant root execution permission
chrome_options.add_argument('--headless')  # Hide browser operation
chrome_options.add_argument('--disable-dev-shm-usage') # Prevent occupying large amounts of memory, causing performance issues or crashes
chrome_options.add_argument('--user-agent=headers')  # Simulate different types of browsers or devices
chrome_options.add_argument('--disable-web-security') # Disable browser's same-origin policy
driver = webdriver.Chrome(options=chrome_options)
# driver = webdriver.Chrome()
driver.get(url)
driver.implicitly_wait(5)  # Implicit wait time is 5 seconds
page_content = driver.page_source  # Get current webpage's HTML source code
driver.quit()

```

# Download Hanime Videos and Save by Year/Month

```python
import os
import requests
from bs4 import BeautifulSoup
import cloudscraper
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


year = 2018
for month in range(4, 13):
    base_url = "https://hanime1.me/search?query=&type=&genre=%E8%A3%8F%E7%95%AA&sort=&year={}&month={}"
    url = base_url.format(year, month)
    scraper = cloudscraper.create_scraper()
    response = scraper.get(url)
    soup = BeautifulSoup(response.text.encode("utf-8"), "html.parser")

    pattern = r'"(https://hanime1\.me/watch\?[^\s]+)"'  # Match links starting with "https://hanime1.me/watch?"
    matches = re.findall(pattern, str(soup))
    download_dir = f"{year}/{month:02}"
    print(download_dir)
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    for matche in matches:
        clean_match = matche.strip("")  # Remove quotes
        headers = {
            'User-Agent': ''
        }
        cookies = {
            "cookies1": ""}
        response2 = scraper.get(matche, cookies=cookies, headers=headers)
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')  # Grant root execution permission
        chrome_options.add_argument('--headless')  # Hide browser operation
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--user-agent=headers')

        chrome_options.add_argument('--disable-web-security')
        driver = webdriver.Chrome(options=chrome_options)
        # driver = webdriver.Chrome()
        driver.get(matche)
        driver.implicitly_wait(5)
        page_content = driver.page_source
        driver.quit()

        # soup2 = BeautifulSoup(response.text.encode("utf-8"), "html.parser")
        soup2 = BeautifulSoup(page_content, 'html.parser')

        # Get 1080p
        source_1080 = soup2.find('source', {'size': '1080'})
        if source_1080:
            src = source_1080.get('src')
            print(f"1080p URL: {src}")
        else:
            # If no size="1080" tag found, look for size="720" tag
            source_720 = soup2.find('source', {'size': '720'})

            if source_720:
                src = source_720.get('src')
                print(f"720p URL: {src}")
            else:
                # If no size="720" tag found, look for size="480" tag
                source_480 = soup2.find('source', {'size': '480'})

                if source_480:
                    src = source_480.get('src')
                    print(f"480p URL: {src}")
                else:
                    print("No matching URL found")

        # pattern2 = soup2.find('source')
        # value = pattern2['src']

        # Download video
        pattern2 = soup2.find('input', {'id': 'video-sd'})
        value = pattern2['value'].split("?")[0]
        video_response = requests.get(src, stream=True)
        video_filename = download_dir
        filename = value.split('/')[-1]
        save_path = os.path.join(download_dir, filename)
        with open(save_path, 'wb') as video_file:
            video_file.write(video_response.content)

        print(f"Downloaded: {save_path}")
    print('Month {} download finished'.format(month))
print('Year {} download finished'.format(year))

```
