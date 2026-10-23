import { describe, expect, it } from 'vitest'

import { splitSql } from '../../../scripts/migrate.mjs'

describe('Execução transacional de migrações', () => {
    it('mantém funções SQL, comentários e textos com ponto e vírgula em uma única instrução', () => {
        const statements = splitSql(`BEGIN;
            -- comentário com ;
            CREATE FUNCTION example() RETURNS void LANGUAGE plpgsql AS $$
            BEGIN
                RAISE NOTICE 'texto; com ''aspas''';
            END;
            $$;
            INSERT INTO example VALUES ('url;final', 'texto--final');
            /* comentário ; /* interno ; */ final */
            SELECT "coluna;nome" FROM example;
            COMMIT;`)
        expect(statements).toHaveLength(3)
        expect(statements[0]).toContain("RAISE NOTICE 'texto; com ''aspas'''")
        expect(statements[1]).toContain("'url;final'")
        expect(statements[2]).toContain('SELECT "coluna;nome"')
    })

    it('mantém corpos com delimitador nomeado', () => {
        expect(splitSql('DO $migration$ BEGIN PERFORM 1; END; $migration$; SELECT 2;')).toHaveLength(2)
    })
})
