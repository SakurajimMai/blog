---
title: Linux绕过CF，爬取hanime里番视频
tags:
  - Python
  - Linux
cover: https://s2.ixacg.com/2025/04/10/1744271725.avif
abbrlink: 24644
createTime: 2026/01/06 11:47:22
permalink: /blog/6g6qjjjo/
---
# 绕过CF盾

用cloudscraper代替requests

<!-- more -->

```python
pip3 install cloudscraper
```

```python
import cloudscraper
scraper = cloudscraper.create_scraper()
response =scraper.get(url)
```

# 爬取网页动态内容，需要安装selenium

```python
pip3 install selenium
```

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
url = "xxxx"
chrome_options = Options()
chrome_options.add_argument('--no-sandbox')  # 给予root执行权限
chrome_options.add_argument('--headless')  # 隐藏浏览器运行
chrome_options.add_argument('--disable-dev-shm-usage') #防止占用大量的内存，从而导致性能问题或崩溃。
chrome_options.add_argument('--user-agent=headers')  #模拟不同类型的浏览器或设备
chrome_options.add_argument('--disable-web-security') #禁用浏览器的同源策略
driver = webdriver.Chrome(options=chrome_options) 
# driver = webdriver.Chrome()
driver.get(url)
driver.implicitly_wait(5)  #隐式等待时间为5秒
page_content = driver.page_source  # 获取当前网页的HTML源代码
driver.quit()

```

# 下载hanime的里番视频，并且以年月的形式保存

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
 
    pattern = r'"(https://hanime1\.me/watch\?[^\s]+)"'  # 匹配以"https://hanime1.me/watch?"开头的链接
    matches = re.findall(pattern, str(soup))
    download_dir = f"{year}/{month:02}"
    print(download_dir)
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)
 
    for matche in matches:
        clean_match = matche.strip("")  # 去掉双引号
        headers = {
            'User-Agent': ''
        }
        cookies = {
            "cookies1": ""}
        response2 = scraper.get(matche, cookies=cookies, headers=headers)
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')  # 给予root执行权限
        chrome_options.add_argument('--headless')  # 隐藏浏览器运行
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
 
        # 获取1080p
        source_1080 = soup2.find('source', {'size': '1080'})
        if source_1080:
            src = source_1080.get('src')
            print(f"1080p URL: {src}")
        else:
            # 如果没有找到size="1080"的标签，再查找size="720"的标签
            source_720 = soup2.find('source', {'size': '720'})
 
            if source_720:
                src = source_720.get('src')
                print(f"720p URL: {src}")
            else:
                # 如果没有找到size="720"的标签，再查找size="480"的标签
                source_480 = soup2.find('source', {'size': '480'})
 
                if source_480:
                    src = source_480.get('src')
                    print(f"480p URL: {src}")
                else:
                    print("未找到任何匹配的URL")
 
        # pattern2 = soup2.find('source')
        # value = pattern2['src']
 
        # 下载视频
        pattern2 = soup2.find('input', {'id': 'video-sd'})
        value = pattern2['value'].split("?")[0]
        video_response = requests.get(src, stream=True)
        video_filename = download_dir
        filename = value.split('/')[-1]
        save_path = os.path.join(download_dir, filename)
        with open(save_path, 'wb') as video_file:
            video_file.write(video_response.content)
 
        print(f"Downloaded: {save_path}")
    print('月份 {} 下载结束'.format(month))
print('年份 {} 下载结束'.format(year))

```