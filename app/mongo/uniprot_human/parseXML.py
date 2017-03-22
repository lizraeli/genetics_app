from lxml import etree
from xmljson import Yahoo
from pymongo import MongoClient
import json
import sys
import os

client = MongoClient()
parser = Yahoo()


# Read data from stdin
def get_database_info():
    info = {}
    info['database'] = input('database name: ')
    info['collection'] = input('collection : ')
    return info

def parseXML(fileName, db):
    # When the script is called from the node app,
    # full path will point to the 'alzheimer_genetics/app' directory
    full_path = os.path.realpath('.')
    try:
        context = etree.iterparse(full_path + "/files/" + fileName, tag="{*}entry")
    except Exception as e:
        print('file not found')
        sys.exit(0)


    for event, element in context:
        new_tree = etree.ElementTree(element)
        new_root = new_tree.getroot()

        # removing namespace from files
        for ele in new_root.iter():
            ele.tag = etree.QName(ele.tag).localname

        # converting to a dictionary
        entryDict = parser.data(new_root)
        #taking the inner "entry" dictionary
        entryDict = entryDict["entry"]
        # inserting into db
        db.insert(entryDict)

        # clearing element and its parents from memory
        element.clear()

        while element.getprevious() is not None:
            del element.getparent()[0]

def main():
    # Get the file path from read_in()
    # info = get_database_info()
    #db = client[info["database"]]
    #coll = db[info["collection"]]
    coll = client.big_data.genes

    xmlFileName = input('file name: ')
    parseXML(xmlFileName, coll)
    print('python: success')

main()
