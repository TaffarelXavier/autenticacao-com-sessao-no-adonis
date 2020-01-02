# __Autenticação no Adonis Usando Sessão__

# 1º Passo:
> ##  Criar o projeto Adonis
\```adonis new autenticacao-com-sessao``\`

Após a criação, execute o comando ``npm install``

# 2º Passo:
> ##  Instalar o __Sqlite3__
> ``npm install sqlite3 --save``
> ou <br>
> ``yarn add sqlite3`` <br>

# 3º Passo:
> ## Executar as migrações:
> ``adonis migration:run``

# 4º Passo:
> ## Criar o __controller User:__ <br>
``adonis make:controller User --type http``

# 5º Passo:

> ## Criando os métodos de:
1. __Registro__
2. __Login__
3. __Mostrar Usuário Logado__
----
 __5.1 Registro__    ``app/Controllers/Http/UserController.js``
----

``` javascript
async register({ auth, request, response }) {
    let user = await User.create(request.all());

    //generate token for user;
    let token = await auth.generate(user);

    Object.assign(user, token);

    return response.json(user);
  }
```

----
 __5.2 Login__       ``app/Controllers/Http/UserController.js``
----

``` javascript
 async login({ auth, request }) {
    const { email, password } = request.all();

    let result = await auth.attempt(email, password);
  
    return result;
  }
```
----
__5.3 Mostrar Usuário Logado__  ``app/Controllers/Http/UserController.js``
----

``` javascript
 async show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone als's profile";
    }
    return auth.user;
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
```

## 7º Passo:
> ## Testes
Criar as rotas:

``http://127.0.0.1:3004/register``<br>
  > Campos: username, email e password

``http://127.0.0.1:3004/login`` <br>
  > Campos: email e password

``http://127.0.0.1:3004/users/1``

Ou baixar o arquivo do ! <a href="https://raw.githubusercontent.com/TaffarelXavier/autenticacao-com-sessao-no-adonis/master/Insomnia_2020-01-02.json" target="_blank">Insomnia_2020-01-02.json</a>


## 8º Erros (KKK) : (

__1 ERRO__. `EBADCSRFTOKEN`<br>
Para corrigirmos esse erro, devemos instalar o provedor `sheild`, via npm, executando o seguinte comando:
`adonis install @adonisjs/shield`<br><br>
Após, ir ao arquivo `config/shield.js` e alterar a opção <br> ``enable: true`` para ``false``.
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