import create_db as cdb
import search as srch
import transform_load as tl
import os
import sys
from termios import tcflush, TCIOFLUSH
import select
import json

def firstRun(info):
    #DATABASE INITIALIZATION

    print('''Here we set up PostgreSQL database for the
            1. Entrez ID to Uniprot ID and gene information table.
            2. Patient gene expression profile file.
            3. Patient age, gender, and education file.
            ''')

    #info = cdb.get_psql_db_info()
    # psql_conn = cdb.psql_init_connect(info) # also sets up database
    psql_conn = cdb.psql_connect(info)
    # When the script is called from the node app,
    # app path will point to the 'alzheimer_genetics/app' directory
    app_path = os.path.realpath('.')

    print()

    file_name = info["entrez_uniprot_file_name"]#input('Enter the file name for Entrez ID, Uniprot ID, and gene info.: ')
    delim = info["entrez_uniprot_delimiter"]#input('Enter the delimiter (comma: ",", tab: "t", space: " "): ')
    #print("python - entrez_uniprot delimiter: ", delim)
    cdb.create_entrez_uniprot_table(psql_conn)
    print("python path: ",  app_path + '/files/' + file_name)
    tl.entrez_uniprot_file_insert(app_path + '/files/' + file_name, delim, psql_conn)

    print('imported ', app_path + '/files/' + file_name)

    file_name = info["patient_file_name"] #input('Enter the file name for patient age, gender, and education: ')
    delim = info["patient_file_delimiter"]#input('Enter the delimiter (comma: ",", tab: "t", space: " "): ')
    cdb.create_patients_table(psql_conn)
    tl.patient_info_file_insert(app_path + '/files/' + file_name, delim, psql_conn)

    print('imported ', app_path + '/files/' + file_name)

    file_name = info["gene_expression_file_name"]#input('Enter the file name for patient gene expression profile: ')
    delim =  info["gene_expression_file_delimiter"]#input('Enter the delimiter (comma: ",", tab: "t", space: " "): ')
    cdb.create_diagnosis_tables(psql_conn)
    if tl.patient_gene_expr_file_insert(app_path + '/files/' + file_name, delim, psql_conn):
        cdb.create_entrez_id_to_index(app_path + '/files/' + file_name, delim, psql_conn)
        print('imported ', app_path + '/files/' + file_name)

def flush_input():
    try:
      import sys, termios
      termios.tcflush(sys.stdin, termios.TCIOFLUSH)
    except Exception as e:
      print(e)

def start():
   # Connecting to postgres
   lines =  sys.stdin.readline().rstrip('\n')
   info = json.loads(lines)

   #print(psql_conn)

   function = info["function"]

   if function == "first_run":
       firstRun(info)
   elif function == "get_patient_info":
       psql_conn = cdb.psql_connect(info)
       results = srch.get_patient_info(info["patient_id"], psql_conn)
       print("diagnosis: ", results[0])
       print("age: ", results[1])
       print("gender: ", results[2])
       print("education: ", results[3])
   elif function == "get_gene_stat":
       psql_conn = cdb.psql_connect(info)
       result = srch.get_gene_stat(info["entrez_id"], info["diagnosis"],  info["stat"], psql_conn)
       print("calculation result: ", result)

start()
