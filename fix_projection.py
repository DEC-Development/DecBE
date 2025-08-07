import os
import json

def fix_projection_location(file_path):
    """
    修复JSON文件中projection字段的位置，将其从elements层级移动到element内部
    """
    try:
        # 读取JSON文件
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 检查是否存在minecraft:template_pool和elements
        if 'minecraft:template_pool' not in data or 'elements' not in data['minecraft:template_pool']:
            print(f"文件 {file_path} 不包含elements字段，跳过处理")
            return False
        
        # 获取elements数组
        elements = data['minecraft:template_pool']['elements']
        
        # 遍历每个element
        modified = False
        for element_item in elements:
            # 检查是否有projection字段在element外面且element里面有element_type
            if 'projection' in element_item and 'element' in element_item and 'element_type' not in element_item:
                # 将projection移动到element内部
                element_item['element']['projection'] = element_item['projection']
                # 删除外层的projection
                del element_item['projection']
                modified = True
        
        # 如果有修改，则写回文件
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"已修改文件: {file_path}")
            return True
        else:
            print(f"文件 {file_path} 无需修改")
            return False
            
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")
        return False

def process_all_json_files(root_folder):
    """
    递归处理文件夹中所有JSON文件
    """
    modified_count = 0
    error_count = 0
    
    # 遍历文件夹及其子文件夹
    for root, dirs, files in os.walk(root_folder):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                try:
                    if fix_projection_location(file_path):
                        modified_count += 1
                except Exception as e:
                    print(f"处理文件 {file_path} 时发生错误: {e}")
                    error_count += 1
    
    print(f"\n处理完成！修改了 {modified_count} 个文件")
    if error_count > 0:
        print(f"有 {error_count} 个文件处理出错")

if __name__ == "__main__":
    # 设置要处理的文件夹路径
    folder_path = r"DecIslandB/worldgen/template_pools"
    
    # 检查文件夹是否存在
    if not os.path.exists(folder_path):
        print(f"文件夹 {folder_path} 不存在，请检查路径")
    else:
        print(f"开始处理文件夹: {folder_path}")
        process_all_json_files(folder_path)