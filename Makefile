.PHONY: client client-prod client-i api 

client:
	cd client && npm start
client-prod:
	cd client && npm run build && npm run prod
client-i:
	cd client && npm i
api:
	cd api && npm run dev