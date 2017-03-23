import os
import sys
import psycopg2
import re
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from psycopg2.extensions import ISOLATION_LEVEL_READ_COMMITTED

def get_psql_db_info():
    info = {}
    info['user'] = input('PostgreSQL username: ')
    info['host'] = 'localhost'#input('PostgreSQL host address: ')
    info['password'] = input('PostgreSQL password: ')
    return info

# Creates PostgreSQL database
def psql_db_init(psql_conn):
    database_name = 'alzheimer_genetics'
    create_database = 'CREATE DATABASE {d};'.format(d=database_name)
    psql_conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = psql_conn.cursor()
    cur.execute('SELECT exists(SELECT * from pg_catalog.pg_database WHERE datname=%s)', (database_name,))

    if not cur.fetchone()[0]:
        cur.execute(create_database)
        psql_conn.commit()
        cur.close()
        psql_conn.set_isolation_level(ISOLATION_LEVEL_READ_COMMITTED)
        print('{d} database created.'.format(d=database_name))
        return database_name
    else:
        cur.close()
        psql_conn.set_isolation_level(ISOLATION_LEVEL_READ_COMMITTED)
        print('ERROR: database {d} already exists.'.format(d=database_name))
        ans = input('Do you want to use the current database {d} (y/n)?'.format(d=database_name))
        if ans:
            return database_name

    return False

# For first time connection. Creates databasee
def psql_init_connect(info):
    try:
        conn = psycopg2.connect(
                user=info['user'],
                host=info['host'],
                password=info['password']
            )
    except:
        return False
        print("ERROR: unable to connect to database.")

    database_name = ''
    while not database_name:
        database_name = psql_db_init(conn)
    info['database'] = database_name

    try:
        conn = psycopg2.connect(
                database=info['database'],
                user=info['user'],
                host=info['host'],
                password=info['password']
            )
    except:
        return False
        print("ERROR: unable to connect to database.")

    return conn

def create_entrez_uniprot_table(table, psql_conn):
    print('The Entre ID, Uniprot ID, and gene info. table will be named "{t}".'.format(t=table))
    #table_name = input('Enter the table name with entrez ID to uniprot ID mapping: ')

    create_table = '''
                CREATE TABLE entrez_uniprot (
                    entrez_id INTEGER PRIMARY KEY,
                    uniprot_id VARCHAR[],
                    gene_name VARCHAR(200)
                );
                '''

    cur = psql_conn.cursor()
    cur.execute('SELECT exists(SELECT * from information_schema.tables WHERE table_name=%s)', (table,))
    if not cur.fetchone()[0]:
        cur.execute(create_table)
        psql_conn.commit()
        cur.close()
        print('"entrez_uniprot" table created.')
        return True

    else:
        cur.close()
        print('ERROR: table "entrez_uniprot" already exists.')
        print('Skipping "entrez_uniprot" table creation')
        return False

def entrez_uniprot_file_insert(in_file,
                                delimiter,
                                table,
                                psql_conn,
                                header = True):
    if delimiter == 't':
        delimiter = '\t'
    elif delimiter == '\' \'':
        delimiter = ' '
    elif delimiter != ',' and delimiter != '\t' and delimiter != ' ':
        print('Error: unrecognized delimiter.')
        return False

    insert_sql = '''
                INSERT INTO {t} (entrez_id, uniprot_id, gene_name)
                VALUES (%s, %s, %s)
                '''.format(t=table)
    select_gene_sql = '''
                        SELECT gene_name FROM entrez_uniprot WHERE entrez_id={id};
                        '''
    update_sql_with_gene = '''
                UPDATE entrez_uniprot SET uniprot_id = array_append(uniprot_id, {d}), gene_name = {n} WHERE entrez_id = {id};
                '''
    update_sql_no_gene = '''
                UPDATE entrez_uniprot SET uniprot_id = array_append(uniprot_id, {d}) WHERE entrez_id = {id};
                '''
    cur = psql_conn.cursor()

    with open(in_file, 'r') as fi:
        counter = 0
        if header:
            next(fi)
        for line in fi:
            counter += 1
            # printing occacionaly
            if counter % 10000 == 0:
                print("inserted ", counter, " rows")
            cur_line = line
            cur_line = cur_line.replace('\n', '')
            data = re.split(r''+delimiter, cur_line)

            select_entrez_sql = 'SELECT entrez_id FROM entrez_uniprot WHERE entrez_id={id};'.format(id=int(data[0]))
            cur.execute(select_entrez_sql)
            entrez_id = cur.fetchone()
            if cur.rowcount > 0: # a corresponding entrez_id value exists
                select_entrez_uniprot_sql = 'SELECT uniprot_id FROM entrez_uniprot WHERE \'{d}\'=ANY(uniprot_id) and entrez_id={id};'.format(d=data[1],id=int(data[0]))
                cur.execute(select_entrez_uniprot_sql)
                if cur.rowcount > 0:
                    duplicate_data = cur.fetchone()
                    print('ERROR: duplicate data {d} for entrez ID {id} is not inserted'.format(d=duplicate_data[0], id=entrez_id[0]))
                else:
                    for index, info in enumerate(data):
                        if info == '' or info is None:
                            data[index] = 'NA'
                    uniprot_id = '\'' + data[1] + '\''
                    cur.execute(select_gene_sql.format(id=int(data[0])))
                    gene_name_result = cur.fetchone()
                    if gene_name_result[0] == '':
                        new_gene_name = '\'' + data[2] + '\''
                        cur.execute(update_sql_with_gene.format(d=uniprot_id,n=new_gene_name,id=int(data[0])))
                    else:
                        cur.execute(update_sql_no_gene.format(d=uniprot_id,id=int(data[0])))
            else: # not contained at all, so insert
                uniprot_id = '{' + data[1] + '}'
                cur.execute(insert_sql, (int(data[0]),uniprot_id,data[2]))

    psql_conn.commit()
    cur.close()

def main():
    # Initalizing Db
    info = get_psql_db_info()
    # Setting up the db
    psql_conn = psql_init_connect(info)

    if psql_conn == False:
        print("invalid credentials")
        sys.exit(0)

    create_entrez_uniprot_table('entrez_uniprot', psql_conn)

    file_name = input('file name: ')

    # When the script is called from the node app,
    # app path will point to the 'alzheimer_genetics/app' directory
    app_path = os.path.realpath('.')
    file_path = app_path + '/files/' + file_name

    if entrez_uniprot_file_insert(file_path,
     't', 'entrez_uniprot', psql_conn):
        print('python: success')

main()
