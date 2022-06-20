import pathlib
import os

def main():
    """ The purpose of this script is to get the first account's address from Ganache
    and assign it as the address of the owner in the file /src/products.json"""

    # access info file from ganache-cli
    file_path = pathlib.Path('.') / '.ganache_output.txt'

    # if file does not exist, raise error
    assert file_path.exists()

    # else, get the content of the file in lines
    with open(file_path, 'r') as file:
        lines = file.readlines()

    # the line needed is the 5th one (index 4)
    assert len(lines) > 5  # Check if Ganache is already running in port 7545
    line = lines[4]

    # get address ## Example: 0xfFb3F97564c13f9F92815332bcda0f7694365F66
    address = line.split(' ')[1]

    # raise error if address not in the correct format (42 chars or all 0s)
    assert len(address) == 42
    assert address != '0x0000000000000000000000000000000000000000'

    # print for debugging
    #print(address)

    # assign address to the products.json file
    file_path_to_modify = pathlib.Path('.') / 'src' / 'products.json'

    # if file does not exist, raise error
    assert file_path_to_modify.exists()

    # else, rename the file as _prev and create a new one
    os.rename(file_path_to_modify, r'./src/products_prev.json')

    with open('./src/products_prev.json', 'r') as prevfile:
        with open('./src/products.json', 'w') as newfile:

            lines = prevfile.readlines()
            for line in lines:
                line_split = line.split(' ')

                if '"owner":' in line_split:
                    #replace address
                    line_split[5] = '"' + address + '"\n'
                    newline = ''
                    for el in line_split:
                        newline = newline + el + ' '
                    newline = newline.rstrip(' ')
                    newfile.write(newline)
                else:
                    newfile.write(line)

    # delete previous version of the file
    os.remove(r'./src/products_prev.json')


if __name__ == '__main__':
    main()
