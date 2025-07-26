import os
import json

def convert_display_name_to_icon(file_path):
    """
    将文件中的 minecraft:display_name 转换为 minecraft:icon 格式
    """
    try:
        # 读取JSON文件
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        modified = False
        
        # 递归搜索并替换组件
        def search_and_replace(obj):
            nonlocal modified
            if isinstance(obj, dict):
                # 检查是否有 minecraft:display_name 组件
                if 'minecraft:display_name' in obj and 'value' in obj['minecraft:display_name']:
                    # 获取value值
                    value = obj['minecraft:display_name']['value']
                    # 删除旧的组件
                    del obj['minecraft:display_name']
                    # 添加新的组件
                    obj['minecraft:icon'] = {
                        "textures": {
                            "default": value
                        }
                    }
                    modified = True
                
                # 递归处理子对象
                for key in obj:
                    search_and_replace(obj[key])
            elif isinstance(obj, list):
                # 递归处理列表中的元素
                for item in obj:
                    search_and_replace(item)
        
        # 在整个数据结构中搜索和替换
        search_and_replace(data)
        
        # 如果有修改，则写回文件
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"已修改文件: {file_path}")
        else:
            print(f"文件未修改: {file_path}")
            
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")

def process_directory(directory_path):
    """
    递归处理目录中的所有JSON文件
    """
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                convert_display_name_to_icon(file_path)

# 使用示例
if __name__ == "__main__":
    # 指定ex_items目录路径
    ex_items_directory = r"e:\MCPEAddons\Dec\DecIslandB\ex_items"
    
    # 处理目录中的所有JSON文件
    process_directory(ex_items_directory)
    
    print("所有文件处理完成！")