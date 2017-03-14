from lxml import etree
from xmljson import Yahoo
from pymongo import MongoClient
import json
import sys

db = MongoClient().big_data.genes
parser = Yahoo()

# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # The input has one line - the path of the xml file
    return lines[0]

def parseXML(fileName):

	context = etree.iterparse(fileName, tag="{*}entry");

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
    xmlFileName = "uniprot-human.xml"#read_in()
    parseXML(xmlFileName)
    print('success')

main()
