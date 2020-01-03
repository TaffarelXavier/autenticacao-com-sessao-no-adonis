# __Autenticação no Adonis Usando Sessão__

# 1º Passo:
> ##  Criar o projeto Adonis
> ``adonis new autenticacao-com-sessao``<br>

# 2º Passo:
> ##  Instalar o __Sqlite3__
> ``npm install sqlite3 --save``<br>
> _ou_ <br>
> ``yarn add sqlite3``
> Seguir este passo: 
> (https://yarnpkg.com/en/package/sqlite3)
>  <br>

# 3º Passo:
> ## Executar as migrações:
> ``adonis migration:run``

# 4º Passo:
> ## Criar o __controller User:__ <br>
``adonis make:controller User --type http``

# 5º Passo:

> ## No novo controller criado (_UserController_) , criaremos três métodos, a saber:
1. __register__ - Cadastrará algum usuário
2. __login__    - Para fazer o login do usuário
3. __show__     - Mostra o usuário logado
4. __logout__   - Faz o logout
----
Antes de criarmos esses métodos, importaremos o `model`  `User` no `UserController` (App/Controllers/Http/UserController.js), desta forma: 
``` js
"use strict";

//Importação:
const User = use('App/Models/User');

class UserController {}
```
__Criação dos métodos__<br>
 __5.1 Register__    ``app/Controllers/Http/UserController.js``
----

``` javascript
async register({ auth, request, response }) {
    let user = await User.create(request.all());

    return response.json(user);
  }
```

----
 __5.2 Login__       ``app/Controllers/Http/UserController.js``
----

``` javascript
 async login({ auth, request, response  }) {
    const { email, password } = request.all();

    try {
      let result = await auth.attempt(email, password);
      return result;
    } catch (error) {
      let errorUser = error.message.startsWith("E_USER_NOT_FOUND");
      let errorPass = error.message.startsWith("E_PASSWORD_MISMATCH");
      let info = { type: "another", message: error.message };

      if (errorUser) {
        info = { type: "user", message: "E_USER_NOT_FOUND" };
      } else if(errorPass) {
        info = { type: "pass", message: "E_PASSWORD_MISMATCH" };
      }
      return response.status(403).send(info);
    }
  }
```
----
__5.3 Show__  ``app/Controllers/Http/UserController.js``
----

``` javascript
 async show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone als's profile";
    }
    return auth.user;
  }
```
__5.4 Logout__ 
``` javascript
 async logout({ request, response, auth }) {
    try {
      const isLogeddin = await auth.check();
      if (isLogeddin) {
        await auth.logout();
      }
      return response.status(401).send({ alert: "DESCONECTADO" });
    } catch (error) {
      response.status(401).send({ alert: "NOT_LOGGEDED" });
    }
  }
  ```
# 6º Passo:
> ## Criando as rotas
``` javascript
//Faz o login
Route.post("/login", "UserController.login").middleware("guest");

//Cadastrar um novo usuário:
Route.post('/register', 'UserController.register')

//Buscar um usuário pelo ID dele
Route.get("users/:id", "UserController.show").middleware("auth");

//Faz o logout
Route.get("/logout", "UserController.logout");
```

## 7º Passo:
> ## Testes
Criar as rotas:

``http://127.0.0.1:3004/register``<br>
  > Campos: username, email e password

``http://127.0.0.1:3004/login`` <br>
  > Campos: email e password

``http://127.0.0.1:3004/users/1``

Ou baixar o arquivo <a href="https://raw.githubusercontent.com/TaffarelXavier/autenticacao-com-sessao-no-adonis/master/Insomnia_2020-01-02.json" target="_blank">Insomnia_2020-01-02.json</a> e use-o no __Insomnia__.


## 8º Erros (KKK) : (

__1 ERRO__. `EBADCSRFTOKEN`<br>
Para corrigirmos esse erro, ir ao arquivo `config/shield.js` e alterar a opção <br> ``enable: true`` para ``false``.
Ficando desta forma:
```javascript
 csrf: {
    enable: false,
    methods: ['POST', 'PUT', 'DELETE'],
    filterUris: [],
    cookieOptions: {
      httpOnly: false,
      sameSite: true,
      path: '/',
      maxAge: 7200
    }
  }
  ```
  ----
  __2 ERRO__. `HttpException`

``` plaintext
E_GUEST_ONLY: Only guest 
user can access the route
POST /login
```

__Esse erro acontece devio à senha incorreta.__

----

__3 Erro:__ `RuntimeException`<br>
```plaintext
RuntimeException
E_RUNTIME_ERROR: Session store is not initiated yet. Make<br> sure that you have included the session <br>middleware inside the list of global middleware. ><br>More details: https://err.sh/adonisjs/errors/E_RUNTIME_ERROR
```
__Esse erro é causado porque deve se colocar o Session no ``Global Middleware``__
Desta forma:
``` javascript 
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session' /*Aqui*/,
  'Adonis/Middleware/AuthInit',
  'App/Middleware/ConvertEmptyStringsToNull'
]
```
