
# 📦 Order Management API (Desafio Backend)

API RESTful desenvolvida com **Node.js**, **Express**, **TypeScript** e **Mongoose**. O projeto gerencia o fluxo de pedidos e usuários, utilizando **Clean Architecture** e persistência em MongoDB.

## 🚀 Tecnologias

- **Runtime:** Node.js (v20+)
- **Linguagem:** TypeScript
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Token)

---

## ⚙️ Pré-requisitos

1. **Node.js** instalado.
2. **MongoDB** rodando na porta padrão (`27017`).

> **Dica Docker:** Se tiver o Docker instalado, suba o banco rapidamente:
> ```bash
> docker run --name mongodb -d -p 27017:27017 mongo
> ```

---

## 🛠️ Instalação e Execução


1. **Clone o repositório e instale as dependências:**

> ```bash
> npm install
> ```

---

2. **Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto (copie o exemplo abaixo):
```ini
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/order-management-challenge
JWT_SECRET=segredo_super_secreto

```


3. **Execute o projeto em modo de desenvolvimento:**
```bash
npm run dev

```


*O servidor iniciará em `http://localhost:3000`.*

---

## ⚡ Guia de Testes (Insomnia)

Para agilizar a avaliação, incluí no projeto o arquivo de exportação do Insomnia (`order-management-challenge.yaml`) já configurado.

### 📥 1. Como Importar

1. No Insomnia, vá em **Import/Export** -> **Import Data** -> **From File**.
2. Selecione o arquivo `order-management-challenge.yaml` na raiz do projeto.

### 🌍 2. Configuração

Selecione o ambiente **"Base Environment"** no canto superior esquerdo para carregar a URL e a automação de token.

### 🔄 3. Fluxo Automático

1. **`POST /register`**: Crie um usuário.
2. **`POST /login`**: Ao fazer login, o **Token JWT** é capturado automaticamente.
3. **Use a API**: As rotas de pedidos (`POST`, `PUT`, `PATCH`) usarão esse token automaticamente.

---

## 🛣️ Rotas da API

| Método | Rota | Descrição | Auth |
| --- | --- | --- | --- |
| `POST` | `/register` | Cria novo usuário | 🔓 Pública |
| `POST` | `/login` | Autentica e gera Token | 🔓 Pública |
| `POST` | `/orders` | Cria pedido | 🔐 Automático |
| `GET` | `/orders` | Lista pedidos (Filtros e Paginação) | 🔐 Automático |
| `PUT` | `/orders/:id` | Edita dados cadastrais (Lab, Paciente) | 🔐 Automático |
| `PATCH` | `/orders/:id/advance` | Avança status (`CREATED`➝`ANALYSIS`➝`COMPLETED`) | 🔐 Automático |

---

## 📚 Exemplos de Uso e Testes

### 1. Criar Pedidos (`POST /orders`)

Copie um dos JSONs abaixo e cole no corpo da requisição.

<details>
<summary><strong>🔻 Clique aqui para ver 10 Exemplos de JSON prontos</strong></summary>

**Exemplo 1: Rotina Básica**

```json
{
  "lab": "Laboratório São Lucas",
  "patient": "Maria Eduarda",
  "customer": "Hospital Santa Clara",
  "services": [
    { "name": "Hemograma Completo", "value": 45.00 },
    { "name": "Glicose em Jejum", "value": 22.00 }
  ]
}

```

**Exemplo 2: Painel Hormonal**

```json
{
  "lab": "Lab Hormonix",
  "patient": "Carlos Andrade",
  "customer": "Endocrino Center",
  "services": [
    { "name": "TSH", "value": 35.90 },
    { "name": "T4 Livre", "value": 35.90 },
    { "name": "Testosterona Total", "value": 60.00 }
  ]
}

```

**Exemplo 3: Imagem (Alto Valor)**

```json
{
  "lab": "Centro de Imagem Avançada",
  "patient": "Fernanda Torres",
  "customer": "Clínica Ortopédica Silva",
  "services": [
    { "name": "Ressonância Magnética", "value": 850.00 },
    { "name": "Raio-X Tórax", "value": 90.00 }
  ]
}

```

**Exemplo 4: Checkup Cardíaco**

```json
{
  "lab": "CardioLab",
  "patient": "Roberto Justus",
  "customer": "Hospital do Coração",
  "services": [
    { "name": "Eletrocardiograma", "value": 120.00 },
    { "name": "Ecocardiograma", "value": 350.50 }
  ]
}

```

**Exemplo 5: Testes Virais**

```json
{
  "lab": "Laboratório Central",
  "patient": "Ana Beatriz",
  "customer": "UPA 24h",
  "services": [
    { "name": "RT-PCR Covid-19", "value": 190.00 },
    { "name": "Influenza A/B", "value": 250.00 }
  ]
}

```

**Exemplo 6: Pediatria**

```json
{
  "lab": "Kids Lab",
  "patient": "Enzo Gabriel",
  "customer": "Pediatria Feliz",
  "services": [
    { "name": "Teste do Pezinho", "value": 300.00 }
  ]
}

```

**Exemplo 7: Perfil Lipídico**

```json
{
  "lab": "Laboratório Exame",
  "patient": "Juliana Paes",
  "customer": "NutriLife",
  "services": [
    { "name": "Colesterol Total", "value": 25.00 },
    { "name": "Triglicerídeos", "value": 28.00 }
  ]
}

```

**Exemplo 8: Urina e Fezes**

```json
{
  "lab": "Laboratório Prevenção",
  "patient": "Pedro Sampaio",
  "customer": "Clínica Geral",
  "services": [
    { "name": "Urina Tipo I", "value": 18.50 },
    { "name": "Urocultura", "value": 45.00 }
  ]
}

```

**Exemplo 9: Alergias**

```json
{
  "lab": "Allergy Center",
  "patient": "Lucas Moura",
  "customer": "Consultório Dr. Drauzio",
  "services": [
    { "name": "IgE Total", "value": 55.00 },
    { "name": "Painel Alérgico", "value": 420.00 }
  ]
}

```

**Exemplo 10: Pré-Operatório**

```json
{
  "lab": "Hospital Sírio",
  "patient": "Amanda Nunes",
  "customer": "Cirurgia Plástica",
  "services": [
    { "name": "Coagulograma", "value": 60.00 },
    { "name": "Eletrocardiograma", "value": 100.00 }
  ]
}

```

</details>

---

### 2. Editar Pedido (`PUT /orders/:id`)

Use esta rota para corrigir dados cadastrais.
*Nota: Não é possível alterar pedidos já finalizados.*

**URL:** `{{ base_url }}/orders/ID_DO_PEDIDO`
**Body:**

```json
{
  "patient": "Nome Corrigido da Silva",
  "lab": "Laboratório Novo"
}

```

---

### 3. Avançar Status (`PATCH /orders/:id/advance`)

Use esta rota para mover o pedido para a próxima etapa.
*Nota: A ordem é estrita: `CREATED` -> `ANALYSIS` -> `COMPLETED`.*

**URL:** `{{ base_url }}/orders/ID_DO_PEDIDO/advance`
**Body:** (Vazio)

1. Envie a 1ª vez: Status muda para **ANALYSIS**.
2. Envie a 2ª vez: Status muda para **COMPLETED**.
3. Envie a 3ª vez: Retorna erro (Pedido já finalizado).
