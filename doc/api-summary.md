# API - summary

## API Machine

### Rôles

ROLE_API_ACCESS_PATIENT_DATA
ROLE_API_CREATION_ANSWER_PATIENT
ROLE_API_CREATE_PATIENT

### Connection / authentification

Les requêtes HTTP vers l'API doivent utiliser les headers HTTP suivants : 

    Content-Type: application/ld+json
    x-auth-token : Signature

La signature est basée sur un couple *username* / *token* fournis par Tmm. La signature est calculée à l'aide du token, du username, de l'URL demandé et d'un horodatage de la requête.
Le processus utilise un système de code d'authentification de message basé sur le hachage (HMAC-SHA512)et suit les étapes ci-dessous:

 1. Concaténer le nom du endpoint (sans les paramètres) avec le timestamp actuel (horodatage du moment de la requête) sans séparateur. Cette valeur doit être une chaîne de caractère en UTF-8.
 2. Envoyer cette valeur dans une routine HMAC-SHA512 avec comme clef secrète la clef API. Le résultat de cette opération doit retourner des chiffres hexadécimaux en minuscule.
 3. Concaténer une nouvelle chaîne de caractères avec le nom de l'utilisateur machine et la précédente signature générée séparée par un double points ":".
 4. Convertir la précédente chaîne de caractères en base64 pour avoir la signature finale.


```php
    // Exemple en PHP
    $url = "http://exemple-aptelecare/value_answers";  
    $endpoint = \parse_url($url)['path'];  
    $timestamp = \time();  
    $signature = \hash_hmac('sha512', \sprintf('%s%d', $endpoint, $timestamp), 'API_KEY_PASSWORD');  
    $finalSignature = \base64_encode('API_USER'. ':' . $signature);  
```

```js
    const CryptoJS = require("crypto-js");

    // Fonction d'encodage en Javascript
    function machineHeaders(headers = {}, url = null) {
      const timestamp = Math.floor(Date.now() / 1000);
      const endpoint =
        url.indexOf("?") !== -1 ? url.substring(0, url.indexOf("?")) : url;
      const signature = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA512(endpoint + timestamp, backendConfig.apiToken)
      );
    
      let buff = new Buffer(backendConfig.apiUser + ":" + signature);
    
      headers["x-auth-token"] = buff.toString("base64");
    
      return {
        headers: {
          ...headers,
          "Content-Type": "application/ld+json"
        }
      };
    }
```

### Les données des patients

    GET /groups
    =>  /groups/2454721e-a098-49b2-8f73-3c239142f19a
    
    GET /patients?group=2454721e-a098-49b2-8f73-3c239142f19a

