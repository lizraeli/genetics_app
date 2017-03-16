import psycopg2


def create_patient_table(connection):
    #TODO allow user to name their tables

    create_table = '''
                CREATE TABLE patients(
                patient_id VARCHAR(20) PRIMARY KEY,
                age SMALLINT,
                gender VARCHAR(1),
                education VARCHAR(20))
                '''
    cur = connection.cursor()
    cur.execute('select exists(SELECT * from information_schema.tables WHERE table_name=%s)', ('patients',))
    if not cur.fetchone()[0]:
        cur.execute(create_table)
        connection.commit()
        print('"patients" table created.')

    else:
        print('ERROR: Table patients already exists.')

    cur.close()

def create_entrez_uniprot_table(connection):
    #TODO allow user to name their tables

    create_table = '''
                CREATE TABLE entrez_uniprot(
                  entrez_id INTEGER PRIMARY KEY,
                  uniprot_id VARCHAR(20),
                  gene_name VARCHAR(200)
                );
                '''
    cur = connection.cursor()
    cur.execute('select exists(SELECT * from information_schema.tables WHERE table_name=%s)', ('entrez_uniprot',))
    if not cur.fetchone()[0]:
        cur.execute(create_table)
        connection.commit()
        print('"entrez_uniprot" table created.')

    else:
        print('ERROR: Table entrez_uniprot already exists.')

    cur.close()

def create_gene_expression_table(connection):
    #TODO allow user to name their tables

    create_table = '''
                CREATE TABLE patient_gene_expr (
                	patient_id VARCHAR(20) PRIMARY KEY,
                	diagnosis INTEGER,
                	gene_id FLOAT[16380]
                );
                '''
    cur = connection.cursor()
    cur.execute('select exists(SELECT * from information_schema.tables WHERE table_name=%s)', ('patient_gene_expr',))
    if not cur.fetchone()[0]:
        cur.execute(create_table)
        connection.commit()
        print('"patient_gene_expr" table created.')
    else:
        print('ERROR: Table patient_gene_expr already exists.')

    cur.close()

def get_database_info():
    info = {}
    info['database'] = input('database name: ')
    info['user'] = input('username: ')
    info['host'] = input('host address: ')
    info['password'] = input('database password: ')
    return info

def main():
    info = get_database_info()
    try:
        conn = psycopg2.connect(
                database=info['database'],
                user=info['user'],
                host=info['host'],
                password=info['password']
            )
    except:
        print("ERROR: unable to connect to database.")

    create_gene_expression_table(conn)
    create_entrez_uniprot_table(conn)
    create_patient_table(conn)

main()
