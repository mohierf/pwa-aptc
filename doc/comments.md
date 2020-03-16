Sujets à discuter : 
===================
Lien SIH
Lien DPI
Lien DMP ?
Signature électronique

Quelques remarques / modifications à apporter :
===============================================
Bonjour :
-----
- faire effacer après quelques secondes

Gestion des token:
-----
- gestion des token: ok pour le changement de token au refresh, ça va bien. Par contre, on devrait allonger la durée de validité... 24/48 heures ?
- sur 403, on révoque le token ? 
	Non


Pagination:
-----
- pagination=false&pageSize=5 ... pas de pagination - pagination=true, ok pour la pagination!

Format:
-----
- Si Content-Type = application/json, ne pas renvoyer du json+ld mais du json simple

Erreurs 500
-----
Plusieurs fois des erreurs 500 lors des tests, il faudrait catcher les exceptions!

Values:
-----
Quand on poste une answer on ne peut pas utiliser l'IRI de la value qui a été reçu mais il faut construire un '/values/id' avec l'ID reçu ... c'est pas très intuitif ni logique.

Properties
-----
minValue: 50
maxValue: 150
computedMinValue: 35
computedMaxValue: 105

Media
-----
 /media/get
 /media/add 
 C'est pas très REST tout ça ...

Informations API / Patient:
-----
- renvoyer toutes les informations du patient dans /me/user_info !
- envoyer les informations du patient (et celles là uniquement) dans /me - idem que /patients/uuid
- envoyer les informations de l'API sur /infos


- uuid, si pas présent l'API doit le créer
- answerDate global et par valeur
- pas de version, c'est forcément la dernière !
- valueAnswers/answer/value!: valueAnswers/value est suffisant -)

Utilisation de l'API
====================

API machine
-----------

    x-auth-token = username:fct(password)
    - fct est un hash du password dépendant du timestamp
    
	Modification proposée:
	----------------------
    x-auth-token = username:password 
    x-auth-token = username:hash(password) 
       

Authentification
----------------

Pas nécessaire si on utilise l'API machine
	
	POST /patient_login_chek
		-> username, password
		<- acces_token, refresh_token
			id, username, lastlogout, roles
		
	Modification proposée:
	----------------------
		POST /login
		-> username, password
		<- acces_token, refresh_token
			id

Information sur un patient:

	GET /me/user_info
		<- info utilisateur, info API
	Modification proposée:
	----------------------
	GET /me
		-> [uuid]
		<- info utilisateur (idem /patients/uuid)
		
	on veut les informations de l'utilisateur courant si un token est fourni
	/me est un alias de /patients/uuid
	----------------------
		
Informations
------------
	
	GET /patients
		<- tous les patients avec pagination
		
	GET /patients/uuid
		uuid récupéré depuis le token JWT (ou autre)
		<- toutes les infos du patient
		
Activités
---------

	GET /free_activities
		-> patient = uuid (6488adb6-6ac4-4c30-9530-d9cd343bcb2e)
		<- [id, @id, lastAnswerDate, patient, prescriber, ...]
		On ne garde que les @id... et on:
	GET /free_activities/@id
		<- id, 
		<- activity:
			[activityValues]:
				value:
					id
					@id
					active
					author
					properties
					question
					type
					name => """Poids"""
					...
		
Récupérer les valeurs
---------------------

	GET /value_answers
		<- hydra-member[0]:
		
		?patient=6488adb6-6ac4-4c30-9530-d9cd343bcb2e
		&value.id=75d03086-7e41-4a81-8d53-b30865e5242b
		&order[receiptDate]=DESC
		&pagination=true&pageSize=1
		
		<-
		@id: "/value_answers/64280c46-b8d2-4cfc-afb5-8ea409a944dd"
		@type: "ValueAnswer"
		activityAnswer: {}
		answer: {
		*******************************
			value: "50" 
		*******************************
		}
		answerDate: "2020-03-14T10:33:17+00:00"
		displayOrder: 0
		duration: null
		id: "64280c46-b8d2-4cfc-afb5-8ea409a944dd"
		late: null
		patient: {}
		patientAlerts: [,…]
		privateValue: {}
		receiptDate: "2020-03-14T10:33:17+00:00"
		theoreticalDate: null
		value: {}
		version: 6


Poster une valeur
-----------------

	POST /activity_answers
		-> {
			id: "b69d60ac-12c8-4f5d-9085-40400ccc4f2b"
			patient: "/patients/6488adb6-6ac4-4c30-9530-d9cd343bcb2e"
			activity: "/activities/fb74f315-4188-4dfe-befd-1f65fb25aa1b"
			answerDate: "2020-03-14 10:33:17"
			valueAnswers: [
				{
					value: "/values/75d03086-7e41-4a81-8d53-b30865e5242b", 
					version: 6, 
					answerDate: "2020-03-14 10:33:17"
					answer: {
						value: "50"
					}
				}
			]
		answerDate est formatté comme une date locale mais il faut que ce soit en UTC !
		Il faut answerDate en global et dans chaque valueAnswers
		Il faut toutes ces informations (version, ...)
		
		
		
	Modification proposée:
	----------------------
	GET /constants
		-> patient = uuid (6488adb6-6ac4-4c30-9530-d9cd343bcb2e)
		<- [constants]
	----------------------

	Modification proposée:
	----------------------
	POST /constant
		-> patient = uuid (6488adb6-6ac4-4c30-9530-d9cd343bcb2e - patients)
		-> constant = uuid (75d03086-7e41-4a81-8d53-b30865e5242b - values)

		-> {
			patient: "6488adb6-6ac4-4c30-9530-d9cd343bcb2e"
			constant: "75d03086-7e41-4a81-8d53-b30865e5242b", 
			timestamp: 1584183571,
			constant: "Poids",
			value: 50
		}
		<- [ok]
		
		id construit par le backend


