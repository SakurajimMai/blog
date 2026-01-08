#!/usr/bin/env python3
"""
Markdown 多语言翻译工具
"""

import argparse
import os
import re
import sys
import json
import requests
from pathlib import Path
from typing import Optional, Tuple

# ============================================================
# 配置区域 - 在此处修改 API 和模型参数
# ============================================================
CONFIG = {
    # Claude Code API 配置 (OpenAI 兼容格式)
    "api_url": "https://www.right.codes/codex/v1/responses",
    "api_key": "xxxxxxx",  # 替换为你的 API Key
    
    # 模型配置
    "model": "gpt-5",
    "max_tokens": 128000,
    "temperature": 0.3,
    
    # 请求配置
    "timeout": 60,  # 超时时间（秒）
}
# ============================================================


def call_api(prompt: str, system_prompt: str = "") -> str:
    """调用 Claude Code API (支持 SSE 流式响应)"""
    
    # 构建请求体 - 使用 OpenAI Responses API 格式
    input_messages = []
    if system_prompt:
        input_messages.append({
            "role": "system",
            "content": system_prompt
        })
    input_messages.append({
        "role": "user",
        "content": prompt
    })
    
    headers = {
        "Authorization": f"Bearer {CONFIG['api_key']}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": CONFIG["model"],
        "input": input_messages,
        "max_output_tokens": CONFIG["max_tokens"],
        "temperature": CONFIG["temperature"],
    }
    
    try:
        response = requests.post(
            CONFIG["api_url"], 
            headers=headers, 
            json=data, 
            timeout=CONFIG.get("timeout", 60),
            stream=True  # 启用流式响应
        )
        
        if not response.ok:
            error_text = response.text[:500] if response.text else '(空响应)'
            print(f"    ❌ API 错误 [{response.status_code}]: {error_text}")
            response.raise_for_status()
        
        # 解析 SSE 流式响应
        full_text = ""
        for line in response.iter_lines(decode_unicode=True):
            if not line:
                continue
            if line.startswith("data: "):
                data_str = line[6:]  # 去掉 "data: " 前缀
                if data_str == "[DONE]":
                    break
                try:
                    event_data = json.loads(data_str)
                    # 提取文本内容
                    if event_data.get("type") == "response.output_text.delta":
                        delta = event_data.get("delta", "")
                        full_text += delta
                    elif event_data.get("type") == "response.completed":
                        # 响应完成，从 output 中提取
                        resp = event_data.get("response", {})
                        output = resp.get("output", [])
                        for item in output:
                            if item.get("type") == "message" and "content" in item:
                                for content in item["content"]:
                                    if content.get("type") == "output_text":
                                        full_text = content.get("text", full_text)
                except json.JSONDecodeError:
                    continue
        
        if not full_text:
            print(f"    ❌ 未能从响应中提取文本")
            raise ValueError("未能从响应中提取文本")
        
        return full_text.strip()
        
    except requests.exceptions.Timeout:
        print(f"    ❌ API 请求超时（{CONFIG.get('timeout', 60)}秒）")
        raise
    except requests.exceptions.RequestException as e:
        print(f"    ❌ API 调用失败: {e}")
        raise


def translate_filename(chinese_name: str) -> str:
    """将中文文件名翻译为英文（URL 友好格式）"""
    name_without_ext = chinese_name.replace(".md", "")
    
    # 如果文件名只包含 ASCII 字符，直接返回
    if name_without_ext.isascii():
        return name_without_ext.lower().replace(" ", "-").replace("_", "-")
    
    system_prompt = """你是一个专业的技术文档翻译助手。你的任务是将中文文件名翻译成简洁的英文格式。

规则：
1. 翻译应简洁、URL 友好
2. 使用连字符（-）分隔单词
3. 全部使用小写字母
4. 不包含 .md 扩展名
5. 只返回翻译结果，不要包含任何解释

示例：
- "一键dd系统网络重装系统" → "one-click-dd-system-reinstall"
- "自建免备案防偷 Tailscale 国内中继（DERP）教程" → "self-hosted-tailscale-derp-relay-tutorial"
- "规避移动墙对域名的封锁" → "bypassing-mobile-carrier-domain-blocking"
- "一步到位的全自动追番教程" → "automatic-anime-tracking-tutorial"
- "Linux 配置 Samba 服务教程" → "linux-samba-service-tutorial"
"""
    
    prompt = f'将以下中文文件名翻译为英文："{name_without_ext}"'
    
    result = call_api(prompt, system_prompt)
    # 清理结果，确保格式正确
    result = result.strip().strip('"').strip("'").lower()
    result = re.sub(r'[^a-z0-9-]', '-', result)
    result = re.sub(r'-+', '-', result)
    result = result.strip('-')
    
    return result


def parse_frontmatter(content: str) -> Tuple[Optional[dict], str]:
    """解析 Frontmatter 和正文"""
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(frontmatter_pattern, content, re.DOTALL)
    
    if not match:
        return None, content
    
    frontmatter_str = match.group(1)
    body = match.group(2)
    
    # 简单解析 YAML frontmatter
    frontmatter = {}
    current_key = None
    
    for line in frontmatter_str.split('\n'):
        if line.startswith('  - '):
            # 这是列表项
            if current_key and current_key in frontmatter:
                if isinstance(frontmatter[current_key], list):
                    frontmatter[current_key].append(line.strip()[2:].strip())
        elif ':' in line:
            key, _, value = line.partition(':')
            key = key.strip()
            value = value.strip()
            current_key = key
            if value:
                frontmatter[key] = value
            else:
                # 可能是列表的开始
                frontmatter[key] = []
    
    return frontmatter, body


def rebuild_frontmatter(frontmatter: dict, lang: str) -> str:
    """重建 Frontmatter 字符串"""
    lines = ["---"]
    
    for key, value in frontmatter.items():
        if isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f"  - {item}")
        elif key == 'permalink':
            # 添加语言前缀
            if not value.startswith(f'/{lang}/'):
                value = f'/{lang}{value}'
            lines.append(f"{key}: {value}")
        else:
            lines.append(f"{key}: {value}")
    
    lines.append("---")
    return '\n'.join(lines)


def translate_content(content: str, target_lang: str, frontmatter: Optional[dict] = None) -> str:
    """翻译 Markdown 内容"""
    lang_name = "English" if target_lang == "en" else "Japanese"
    lang_code = "en" if target_lang == "en" else "ja"
    
    system_prompt = f"""你是一个专业的技术文档翻译助手，专注于将中文 Markdown 技术文档翻译成{lang_name}。

翻译规则：
1. 保持 Markdown 格式完整不变（标题、列表、表格、引用等）
2. 代码块内的内容保持原样，不翻译
3. URL、路径、命令字符串保持原样
4. 技术术语、品牌名称保持原样（如 Linux, Docker, Nginx 等）
5. 配置文件内容保持原样
6. 只翻译需要本地化的文本内容
7. 保持技术文档的专业性和准确性
8. 保持原文的语气和风格

重要：只返回翻译后的内容，不要包含任何解释或额外说明。"""

    # 如果有 frontmatter，先翻译 title 和 tags
    translated_frontmatter = ""
    if frontmatter:
        # 翻译 title
        if 'title' in frontmatter:
            title_prompt = f"将以下技术文档标题翻译成{lang_name}，只返回翻译结果：\n{frontmatter['title']}"
            translated_title = call_api(title_prompt, "你是专业的技术文档翻译助手。只返回翻译结果，不要包含任何解释。")
            frontmatter['title'] = translated_title.strip().strip('"')
        
        # 翻译 tags
        if 'tags' in frontmatter and frontmatter['tags']:
            tags_prompt = f"将以下技术标签翻译成{lang_name}，每个标签一行，只返回翻译结果：\n" + '\n'.join(frontmatter['tags'])
            translated_tags = call_api(tags_prompt, "你是专业的技术文档翻译助手。只返回翻译结果，每个标签一行。")
            frontmatter['tags'] = [tag.strip().strip('-').strip() for tag in translated_tags.strip().split('\n') if tag.strip()]
        
        translated_frontmatter = rebuild_frontmatter(frontmatter, lang_code)
    
    # 翻译正文
    body_prompt = f"翻译以下 Markdown 技术文档内容到{lang_name}：\n\n{content}"
    translated_body = call_api(body_prompt, system_prompt)
    
    if translated_frontmatter:
        return translated_frontmatter + '\n' + translated_body
    return translated_body


def get_target_path(source_path: Path, target_lang: str, translated_filename: str) -> Path:
    """计算目标文件路径"""
    parts = source_path.parts
    docs_index = -1
    for i, part in enumerate(parts):
        if part == 'docs':
            docs_index = i
            break
    
    if docs_index == -1:
        raise ValueError(f"无法找到 docs 目录: {source_path}")
    
    base_parts = list(parts[:docs_index + 1])
    base_parts.append(target_lang)
    base_parts.extend(parts[docs_index + 1:-1])
    
    target_dir = Path(*base_parts)
    target_path = target_dir / f"{translated_filename}.md"
    
    return target_path


def process_file(source_path: Path, target_langs: list[str]) -> None:
    """处理单个文件"""
    print(f"\n📄 {source_path}")
    
    # 读取源文件内容
    with open(source_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 解析 frontmatter
    frontmatter, body = parse_frontmatter(content)
    
    # 翻译文件名
    translated_filename = translate_filename(source_path.stem)
    print(f"    📝 Filename: {source_path.stem} -> {translated_filename}")
    
    for lang in target_langs:
        lang_name = "English" if lang == "en" else "Japanese"
        
        # 计算目标路径
        target_path = get_target_path(source_path, lang, translated_filename)
        
        # 检查目标文件是否已存在
        if target_path.exists():
            print(f"  ⏭️  -> {lang_name}... (已存在，跳过)")
            continue
        
        # 确保目标目录存在
        target_path.parent.mkdir(parents=True, exist_ok=True)
        
        print(f"  🔄 -> {lang_name}...")
        
        try:
            # 复制 frontmatter 以避免修改原始数据
            fm_copy = None
            if frontmatter:
                fm_copy = {}
                for k, v in frontmatter.items():
                    if isinstance(v, list):
                        fm_copy[k] = list(v)
                    else:
                        fm_copy[k] = v
            
            # 翻译内容
            translated_content = translate_content(body, lang, fm_copy)
            
            # 写入目标文件
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(translated_content)
            
            print(f"  ✅ {target_path}")
        except Exception as e:
            print(f"  ❌ 翻译失败: {e}")


def process_directory(dir_path: Path, target_langs: list[str], recursive: bool = True) -> None:
    """处理目录"""
    # 获取所有 .md 文件
    if recursive:
        md_files = list(dir_path.rglob("*.md"))
    else:
        md_files = list(dir_path.glob("*.md"))
    
    # 过滤掉已经在 en/ 或 ja/ 目录下的文件
    md_files = [f for f in md_files if '/en/' not in str(f).replace('\\', '/') and '/ja/' not in str(f).replace('\\', '/')]
    
    print(f"\n📁 找到 {len(md_files)} 个待翻译文件")
    
    for md_file in md_files:
        process_file(md_file, target_langs)


def print_header(path: str, langs: list[str]):
    """打印头部信息"""
    print("=" * 50)
    print(f"📚 Markdown Translator (DeepSeek API)")
    print("=" * 50)
    print(f"📍 {path}")
    print(f"🌐 {', '.join(langs)}")
    print("-" * 50)


def print_footer():
    """打印尾部信息"""
    print("\n" + "=" * 50)
    print("✨ Done!")
    print("=" * 50)


def main():
    parser = argparse.ArgumentParser(
        description='Markdown 多语言翻译工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
示例:
  %(prog)s docs/blog/misc/test.md              翻译为英文和日文
  %(prog)s docs/blog/misc/test.md --lang en    只翻译为英文
  %(prog)s docs/blog/                          翻译目录下所有 md 文件（递归）
  %(prog)s docs/blog/ --no-recursive           翻译目录下所有 md 文件（不递归）
'''
    )
    
    parser.add_argument('path', help='要翻译的文件或目录路径')
    parser.add_argument('-l', '--lang', choices=['en', 'ja'], 
                        help='目标语言（en=英文, ja=日文，不指定则翻译为两种语言）')
    parser.add_argument('--no-recursive', action='store_true',
                        help='不递归处理子目录')
    
    args = parser.parse_args()
    
    # 确定目标语言
    if args.lang:
        target_langs = [args.lang]
    else:
        target_langs = ['en', 'ja']
    
    # 处理路径
    path = Path(args.path)
    if not path.exists():
        print(f"❌ 错误: 路径不存在: {path}")
        sys.exit(1)
    
    # 打印头部
    print_header(str(path.resolve()), target_langs)
    
    if path.is_file():
        if not path.suffix == '.md':
            print(f"❌ 错误: 只支持 .md 文件: {path}")
            sys.exit(1)
        process_file(path, target_langs)
    elif path.is_dir():
        process_directory(path, target_langs, recursive=not args.no_recursive)
    else:
        print(f"❌ 错误: 无效的路径: {path}")
        sys.exit(1)
    
    # 打印尾部
    print_footer()


if __name__ == '__main__':
    main()
