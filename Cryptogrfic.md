# Cryptografic Overview
## Um was geht es: 
- Passwörter müssen als Hash in der DB gespeichert werden. 
- Die Secrets müssen verschlüsselt in der DB gespeichert werden. 
------ 
- Ein User registriert sich mit username und password. 
- Ein User kommt zurück und macht ein login mit username und password. 

## Requirements 
- Beim registrieren wird das Password als Hash in DB gespeichert. 
- Der Hash verwendet Salt und Pepper. 
- Beim Login wird das Password erneut ge-hashed und mit den Hash in der Datenbank verglichen. 
- Klartext-Passwörter in der DB müssen ersetzte werden. 

## INFOS 
### HASH_verfahren
Ein Hash ist eine Funktion, die ein Password in eine andere Zeichenfolge umwandelt. <br>
Eigenschaft: 
- Gleiche Eingabe --> Gleicher Hash
- fixe Länge
- nicht zurückrechenbar

Beispiel: 
MyPassword (Das was der User eingibt) => EF30E (Speichert nur den Hash in DB)
{Hash wird mit gespeichertem Hash verglichen}

### Salt
Ein Salt ist ein zufälliger Wert, der zum Password hinzugefügt wird bevor der Hash erstellt wird. <br>
Problem ohne Salt => Gleiche Passwörter = gleicher Hash
<br> Hash = hash(Passwort + Salt) <br>

Beispiel Datenbank:

User	Passwort	Hash
Anna	123456	abc
Tom	123456	abc

Mit Salt:

User	Passwort	Salt	Hash
Anna	123456	X1	xyz
Tom	123456	P9	lmn

### Pepper
Ein Pepper ist ein geheimer WErt, der auf dem Server(APP) gespeichert wird. <br>
Hash = hash(Passwort + Salt + Pepper) <br>

Eigenschaften: <br>
- Für alle User gleich.
- nicht in der DB gespeichert.
- nur im Server-code oder in Environment Variablen

## Fazit
Eingabe Passwort <br>
  ↓ <br>
&plus; Salt (DB) <br>
&plus; Pepper (Server) <br>
  ↓ <br>
  Hash berechnen <br>
  ↓ <br>
  Mit DB Hash vergleichen
