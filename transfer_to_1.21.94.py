import os
import json
import random

def read_salt_from_files(directory):
    """
    读取指定目录下所有JSON文件中的salt值
    
    Args:
        directory (str): 要读取的目录路径
        
    Returns:
        dict: 文件名到salt值的映射字典
    """
    salt_dict = {}
    
    # 遍历目录中的所有.json文件
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            file_path = os.path.join(directory, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # 提取salt值
                    if 'minecraft:structure_set' in data and 'placement' in data['minecraft:structure_set']:
                        salt = data['minecraft:structure_set']['placement']['salt']
                        salt_dict[filename] = salt
            except (json.JSONDecodeError, KeyError) as e:
                print(f"读取文件 {filename} 时出错: {e}")
    
    return salt_dict

def generate_salt(init=False, directory='DecIslandB/worldgen/structure_sets'):
    """
    生成salt值并保存到salt.json文件
    
    Args:
        init (bool): 是否重新初始化所有salt值
        directory (str): 结构集文件所在的目录
    """
    salt_file = 'salt.json'
    existing_salts = set()
    salt_dict = {}
    
    # 如果salt.json文件存在且不是初始化模式，则读取现有salt值
    if os.path.exists(salt_file) and not init:
        try:
            with open(salt_file, 'r', encoding='utf-8') as f:
                salt_dict = json.load(f)
            # 收集已有的salt值以避免重复
            existing_salts = set(salt_dict.values())
        except json.JSONDecodeError:
            print("salt.json文件格式错误，将重新生成所有salt值")
            salt_dict = {}
    
    # 读取所有结构集文件
    current_salts = read_salt_from_files(directory)
    
    # 为每个文件生成或保留salt值
    updated_salt_dict = {}
    
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            if init:
                # 初始化模式：为所有文件生成新的salt值
                new_salt = generate_unique_salt(existing_salts)
                updated_salt_dict[filename] = new_salt
                existing_salts.add(new_salt)
            else:
                # 非初始化模式：检查文件是否已存在salt值
                if filename in salt_dict:
                    # 保留已存在的salt值
                    updated_salt_dict[filename] = salt_dict[filename]
                else:
                    # 为新文件生成新的salt值
                    new_salt = generate_unique_salt(existing_salts)
                    updated_salt_dict[filename] = new_salt
                    existing_salts.add(new_salt)
    
    # 将更新后的salt值保存到文件
    with open(salt_file, 'w', encoding='utf-8') as f:
        json.dump(updated_salt_dict, f, indent=2, ensure_ascii=False)
    
    print(f"已保存 {len(updated_salt_dict)} 个salt值到 {salt_file}")
    
    # 将salt值写入对应的结构集文件
    write_salt_to_files(updated_salt_dict, directory)
    
    return updated_salt_dict

def generate_unique_salt(existing_salts, min_value=0, max_value=99999999):
    """
    生成一个唯一的salt值
    
    Args:
        existing_salts (set): 已存在的salt值集合
        min_value (int): 最小值
        max_value (int): 最大值
        
    Returns:
        int: 唯一的salt值
    """
    while True:
        new_salt = random.randint(min_value, max_value)
        if new_salt not in existing_salts:
            return new_salt

def write_salt_to_files(salt_dict, directory):
    """
    将salt值写入对应的结构集文件
    
    Args:
        salt_dict (dict): 文件名到salt值的映射字典
        directory (str): 结构集文件所在的目录
    """
    for filename, salt in salt_dict.items():
        file_path = os.path.join(directory, filename)
        try:
            # 读取原文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 更新salt值
            if 'minecraft:structure_set' in data and 'placement' in data['minecraft:structure_set']:
                data['minecraft:structure_set']['placement']['salt'] = salt
                
                # 写回文件
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                    
                print(f"已更新 {filename} 中的salt值为 {salt}")
            else:
                print(f"文件 {filename} 格式不正确，无法更新salt值")
        except (json.JSONDecodeError, KeyError, IOError) as e:
            print(f"更新文件 {filename} 时出错: {e}")

# 使用示例
if __name__ == "__main__":
    # 读取当前目录下的所有结构集文件的salt值
    salts = read_salt_from_files('DecIslandB/worldgen/structure_sets')
    print("当前目录中的salt值:")
    for filename, salt in salts.items():
        print(f"  {filename}: {salt}")
    
    print("\n" + "="*50 + "\n")
    
    # # 示例1: 初始化模式 - 为所有文件重新生成salt值
    # print("初始化模式 - 重新生成所有salt值:")
    # all_new_salts = generate_salt(init=True)
    # for filename, salt in list(all_new_salts.items())[:5]:  # 只显示前5个
    #     print(f"  {filename}: {salt}")
    # if len(all_new_salts) > 5:
    #     print(f"  ... 还有 {len(all_new_salts) - 5} 个文件")
    
    # print("\n" + "="*50 + "\n")
    
    # 示例2: 更新模式 - 只为新文件生成salt值
    print("更新模式 - 只为新文件生成salt值:")
    updated_salts = generate_salt(init=False)
    for filename, salt in list(updated_salts.items())[:5]:  # 只显示前5个
        print(f"  {filename}: {salt}")
    if len(updated_salts) > 5:
        print(f"  ... 还有 {len(updated_salts) - 5} 个文件")