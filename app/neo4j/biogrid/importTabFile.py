from py2neo import authenticate, Graph,  Node, Relationship
import csv





# Read data from stdin
def getDatabaseInfo():
	info = {}
	info['username'] = input('username: ')
	info['password'] = input('password: ')
	return info

def parseTabFile(fileName):
	with open(fileName,'rt') as source:
		reader = csv.reader(source, delimiter='\t')
		# Skipping header row
		next(reader)

		# Starting neo4j transaction
		graph = Graph()
		transaction = graph.begin()

		# Initializing counters and hash tables
		interactionCounter = 0 
		nodeCounter = 0
		nodeTable = {}
		interactionTable = {}

		for line in reader:
			# Getting entrez id's
			gene_id1 = line[1]
			gene_id2 = line[2]

			node1 = Node("Gene", entrez_id=gene_id1)
			node2 = Node("Gene", entrez_id=gene_id2)

			# Creating unique key by concatenating the two id's
			interaction = gene_id1 + gene_id2

			#checking if one of the genes is missing
			if gene_id1 == '-' or gene_id2 == '-':
				pass
			elif interaction in interactionTable:
				pass
			else:
				if gene_id1 not in nodeTable:
					transaction.merge(node1)
					# Recording node in nodetable
					nodeTable[gene_id1] = 1
					nodeCounter+=1
				
				if gene_id2 not in nodeTable:
					transaction.merge(node2)
					# Recording node in nodeTable
					nodeTable[gene_id2] = 1
					nodeCounter+=1

				# Recording interaction in interaction table
				interactionTable[interaction] = 1
				interactionCounter += 1

				relationship = Relationship(node1, "interacts_with", node2)
				transaction.merge(relationship)

				if interactionCounter % 500 == 0:
					transaction.commit()
					transaction = graph.begin()
					print("commited ", interactionCounter, " rows")

		# Commiting last unifinished transaction
		transaction.commit()
		# Printing stats		
		print('interactions:', interactionCounter)
		print('nodes:', nodeCounter)	


def main():
	# Geting the db info from user
	info = getDatabaseInfo()
	# Authenticating user
	authenticate("localhost:7474", info["username"], info["password"])

	# Getting file name
	tabFileName = input('file name: ')
	parseTabFile(tabFileName)



main()


