---
title: LinuxでCFをバイパスしてHanime動画をスクレイピング
tags:
  - Python
  - Linux
cover: https://s2.ixacg.com/2025/04/10/1744271725.avif
abbrlink: 24644
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/6g6qjjjo/
---

# Cloudflare シールドをバイパス

requests の代わりに cloudscraper を使用

<!-- more -->

```python
pip3 install cloudscraper
```

```python
import cloudscraper
scraper = cloudscraper.create_scraper()
response =scraper.get(url)
```

# 動的 Web コンテンツのスクレイピング、Selenium のインストールが必要

```python
pip3 install selenium
```

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
url = "xxxx"
chrome_options = Options()
chrome_options.add_argument('--no-sandbox')  # root実行権限を付与
chrome_options.add_argument('--headless')  # ブラウザを非表示で実行
chrome_options.add_argument('--disable-dev-shm-usage') # 大量のメモリを占有してパフォーマンス問題やクラッシュを引き起こすのを防ぐ
chrome_options.add_argument('--user-agent=headers')  # 異なるタイプのブラウザやデバイスをシミュレート
chrome_options.add_argument('--disable-web-security') # ブラウザの同一オリジンポリシーを無効化
driver = webdriver.Chrome(options=chrome_options)
# driver = webdriver.Chrome()
driver.get(url)
driver.implicitly_wait(5)  # 暗黙の待機時間は5秒
page_content = driver.page_source  # 現在のWebページのHTMLソースコードを取得
driver.quit()

```

# Hanime 動画をダウンロードして年/月形式で保存

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

    pattern = r'"(https://hanime1\.me/watch\?[^\s]+)"'  # "https://hanime1.me/watch?"で始まるリンクにマッチ
    matches = re.findall(pattern, str(soup))
    download_dir = f"{year}/{month:02}"
    print(download_dir)
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    for matche in matches:
        clean_match = matche.strip("")  # 引用符を削除
        headers = {
            'User-Agent': ''
        }
        cookies = {
            "cookies1": ""}
        response2 = scraper.get(matche, cookies=cookies, headers=headers)
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')  # root実行権限を付与
        chrome_options.add_argument('--headless')  # ブラウザを非表示で実行
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

        # 1080pを取得
        source_1080 = soup2.find('source', {'size': '1080'})
        if source_1080:
            src = source_1080.get('src')
            print(f"1080p URL: {src}")
        else:
            # size="1080"のタグが見つからない場合、size="720"のタグを探す
            source_720 = soup2.find('source', {'size': '720'})

            if source_720:
                src = source_720.get('src')
                print(f"720p URL: {src}")
            else:
                # size="720"のタグが見つからない場合、size="480"のタグを探す
                source_480 = soup2.find('source', {'size': '480'})

                if source_480:
                    src = source_480.get('src')
                    print(f"480p URL: {src}")
                else:
                    print("一致するURLが見つかりませんでした")

        # pattern2 = soup2.find('source')
        # value = pattern2['src']

        # 動画をダウンロード
        pattern2 = soup2.find('input', {'id': 'video-sd'})
        value = pattern2['value'].split("?")[0]
        video_response = requests.get(src, stream=True)
        video_filename = download_dir
        filename = value.split('/')[-1]
        save_path = os.path.join(download_dir, filename)
        with open(save_path, 'wb') as video_file:
            video_file.write(video_response.content)

        print(f"ダウンロード完了: {save_path}")
    print('{}月のダウンロード終了'.format(month))
print('{}年のダウンロード終了'.format(year))

```
