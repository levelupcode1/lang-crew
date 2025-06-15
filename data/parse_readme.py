#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import csv
import uuid
from datetime import datetime

def generate_uuid():
    """Generate a unique UUID for each project"""
    return str(uuid.uuid4())

def clean_description(text):
    """Clean description by removing emojis and extra whitespace"""
    # Remove emoji and special characters at the beginning
    emoji_pattern = r'^[\s📇🏠🍎🪟🐧☁️🌐🐍🚀🏎️⚡️🖱️🎖️#️⃣🦀☕🔥⛅️💬🛠️🔒🛡️🤖🔮🌱📊🦮🎬📹🔍📚💻🖥️🗄️💰🎮🧠🗺️🎯🏃🌎🚆🔄💾🎨🏕️🏛️📜⚙️📱💼🗂️🎵🎸🎹🎤🎧🎼🎭🎪🖼️🎲🃏🀄🎰📕📒📓📔📖📗📘📙📚📝📌📍📎🖇️📏📐✂️🗃️🗄️🗑️🖌️🖍️✏️✒️🖋️🖊️📝💼📁📂🗂️📅📆🗒️🗓️📇📈📉📊📋₿🦽🎖🦮🤖🔮🌱🌐🖱️⚡️🚀⛅️🏛️🏕️💾📜⚙️📱💼🗂️🎵🎸🎹🎤🎧🎼🎭🎪🖼️🎲🃏🀄🎰\s-]+' 
    text = re.sub(emoji_pattern, '', text)
    # Remove multiple spaces and newlines
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_projects(content, category_name):
    """Parse project entries from category content"""
    projects = []
    lines = content.split('\n')
    
    for line in lines:
        # Skip empty lines and non-project lines
        if not line.strip().startswith('- ['):
            continue
            
        # Extract project name and URL
        match = re.match(r'- \[([^\]]+)\]\(([^\)]+)\)', line)
        if not match:
            continue
            
        project_name = match.group(1).strip()
        url = match.group(2).strip()
        
        # Skip if not a valid URL
        if not url.startswith('http'):
            continue
            
        # Extract description (everything after the link)
        after_link = line[match.end():]
        description = clean_description(after_link)
        
        # Create project entry
        project = {
            'uuid': generate_uuid(),
            'name': project_name.replace('@', '').replace('/', '-'),
            'title': project_name,
            'description': description[:500] if description else '',
            'url': url,
            'category': category_name,
            'status': 'active',
            'created_at': 'NOW()'
        }
        projects.append(project)
    
    return projects

def write_csv(projects, filename):
    """Write projects to CSV file"""
    if not projects:
        print(f"No projects to write for {filename}")
        return
        
    headers = ['uuid', 'name', 'title', 'description', 'url', 'category', 'status', 'created_at']
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        writer.writerows(projects)
    
    print(f"Written {len(projects)} projects to {filename}")

def main():
    # Read the README file
    with open('/Volumes/MacPro16/projects/proj-langcrew/lang-crew/data/README-ko.md', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Define categories to process
    categories = {
        'browser_automation': {
            'header': '### 📂 <a name="browser-automation"></a>브라우저 자동화',
            'filename': 'projects_browser_automation.csv'
        },
        'art_and_culture': {
            'header': '### 🎨 <a name="art-and-culture"></a>예술 및 문화',
            'filename': 'projects_art_and_culture.csv'
        },
        'cloud_platforms': {
            'header': '### ☁️ <a name="cloud-platforms"></a>클라우드 플랫폼',
            'filename': 'projects_cloud_platforms.csv'
        },
        'command_line': {
            'header': '### 🖥️ <a name="command-line"></a>커맨드 라인',
            'filename': 'projects_command_line.csv'
        },
        'communication': {
            'header': '### 💬 <a name="communication"></a>커뮤니케이션',
            'filename': 'projects_communication.csv'
        },
        'customer_data_platforms': {
            'header': '### 👤 <a name="customer-data-platforms"></a>고객 데이터 플랫폼',
            'filename': 'projects_customer_data_platforms.csv'
        },
        'data_platforms': {
            'header': '### 📊 <a name="data-platforms"></a>데이터 플랫폼',
            'filename': 'projects_data_platforms.csv'
        },
        'databases': {
            'header': '### 🗄️ <a name="databases"></a>데이터베이스',
            'filename': 'projects_databases.csv'
        },
        'developer_tools': {
            'header': '### 💻 <a name="developer-tools"></a>개발자 도구',
            'filename': 'projects_developer_tools.csv'
        },
        'data_science_tools': {
            'header': '### 🧮 데이터 과학 도구',
            'filename': 'projects_data_science_tools.csv'
        },
        'file_systems': {
            'header': '### 📂 <a name="file-systems"></a>파일 시스템',
            'filename': 'projects_file_systems.csv'
        },
        'finance_fintech': {
            'header': '### 💰 <a name="finance--fintech"></a>금융 및 핀테크',
            'filename': 'projects_finance_fintech.csv'
        },
        'gaming': {
            'header': '### 🎮 <a name="gaming"></a>게임',
            'filename': 'projects_gaming.csv'
        },
        'knowledge_memory': {
            'header': '### 🧠 <a name="knowledge--memory"></a>지식 및 메모리',
            'filename': 'projects_knowledge_memory.csv'
        },
        'location_services': {
            'header': '### 🗺️ <a name="location-services"></a>위치 서비스',
            'filename': 'projects_location_services.csv'
        },
        'marketing': {
            'header': '### 🎯 <a name="marketing"></a>마케팅',
            'filename': 'projects_marketing.csv'
        },
        'monitoring': {
            'header': '### 📊 <a name="monitoring"></a>모니터링',
            'filename': 'projects_monitoring.csv'
        },
        'search': {
            'header': '### 🔎 <a name="search"></a>검색',
            'filename': 'projects_search.csv'
        },
        'security': {
            'header': '### 🔒 <a name="security"></a>보안',
            'filename': 'projects_security.csv'
        },
        'sports': {
            'header': '### 🏃 <a name="sports"></a>스포츠',
            'filename': 'projects_sports.csv'
        },
        'translation_services': {
            'header': '### 🌎 <a name="translation-services"></a>번역 서비스',
            'filename': 'projects_translation_services.csv'
        },
        'travel_and_transportation': {
            'header': '### 🚆 <a name="travel-and-transportation"></a>여행 및 교통',
            'filename': 'projects_travel_and_transportation.csv'
        },
        'version_control': {
            'header': '### 🔄 <a name="version-control"></a>버전 관리',
            'filename': 'projects_version_control.csv'
        },
        'other_tools_and_integrations': {
            'header': '### 🛠️ <a name="other-tools-and-integrations"></a>기타 도구 및 통합',
            'filename': 'projects_other_tools_and_integrations.csv'
        }
    }
    
    # Process each category
    for category_key, category_info in categories.items():
        print(f"\nProcessing category: {category_key}")
        
        # Find the start of the category
        start_idx = content.find(category_info['header'])
        if start_idx == -1:
            print(f"  Category not found: {category_info['header']}")
            continue
        
        # Find the end of the category (next ### or ## or end of file)
        end_idx = content.find('\n###', start_idx + 1)
        if end_idx == -1:
            end_idx = content.find('\n##', start_idx + 1)
            if end_idx == -1:
                end_idx = len(content)
        
        # Extract category content
        category_content = content[start_idx:end_idx]
        
        # Parse projects
        projects = parse_projects(category_content, category_key)
        
        # Write to CSV
        output_path = f'/Volumes/MacPro16/projects/proj-langcrew/lang-crew/data/{category_info["filename"]}'
        write_csv(projects, output_path)

if __name__ == '__main__':
    main()
