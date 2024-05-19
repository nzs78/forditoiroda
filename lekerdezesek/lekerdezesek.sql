A feladatok megoldására elkészített SQL parancsokat illessze be a feladat sorszáma után!
***
1. feladat
CREATE DATABASE iroda
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;
***
3. feladat
UPDATE szemely
SET szemely.nev='Püsky Kata'
WHERE szemely.nev LIKE 'Püski Kata';
***
4. feladat
SELECT COUNT(*) as 'darab', SUM(nyelv.egysegar) as 'osszbevetel'
FROM doku
	INNER JOIN nyelv ON (nyelv.id=doku.nyelvid)
WHERE doku.terjedelem<=5000;
***
5. feladat
SELECT doku.szakterulet, SUM(doku.terjedelem) as 'osszterjedelem'
FROM doku
	INNER JOIN nyelv ON (doku.nyelvid=nyelv.id)
WHERE nyelv.fnyelv LIKE 'magyar' AND nyelv.cnyelv LIKE 'angol'    
GROUP BY doku.szakterulet
ORDER BY osszterjedelem DESC
***
6. feladat
SELECT szemely.nev
FROM szemely
	INNER JOIN fordito ON (fordito.szemelyid = szemely.id)
    INNER JOIN nyelv ON (nyelv.id=fordito.nyelvid)
WHERE nyelv.fnyelv LIKE 'magyar'
GROUP BY szemely.nev
ORDER BY COUNT(*) DESC
LIMIT 1;



