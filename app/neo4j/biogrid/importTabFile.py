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

			# merge statement params will be populated dynamically
			statement = '''MERGE (gene1:Gene { entrez_id: {a} })
							MERGE (gene2:Gene { entrez_id: {b} })
							MERGE (gene1)-[:interacts_with]-(gene2)'''
							
			# Creating unique key by concatenating the two id's
			if gene_id1 > gene_id2:
				interaction = gene_id1 + gene_id2
			else:
				interaction = gene_id2 + gene_id1

			#checking if one of the genes is missing
			if gene_id1 == '-' or gene_id2 == '-':
				pass
			elif interaction in interactionTable:
				pass
			else:
				if gene_id1 not in nodeTable:
					#transaction.create(node1)
					# Recording node in nodetable
					nodeTable[gene_id1] = 1
					nodeCounter+=1

				if gene_id2 not in nodeTable:
					#transaction.create(node2)
					# Recording node in nodeTable
					nodeTable[gene_id2] = 1
					nodeCounter+=1

				# Recording interaction in interaction table
				interactionTable[interaction] = 1
				interactionCounter += 1



				transaction.run(statement, a = gene_id1, b = gene_id2)

				if interactionCounter % 500 == 0:
					print("commited ", nodeCounter, " nodes")
					print("         ", interactionCounter, " interactions")
					transaction.commit()
					transaction = graph.begin()


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
