import {prisma} from "../src/database"
import supertest from "supertest";
import app from "../src/app"
import itemFactory from "./factories/itemFactory";

const agent = supertest(app)


describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
      const item = itemFactory()

      const result = await agent.post("/items").send(item)
      const status = result.status

      const createdItem = await prisma.items.findFirst({where:{title:item.title}})

      expect(status).toEqual(201)
      expect(createdItem).not.toBeNull();
      
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = itemFactory()

    const insertFirstItem = await agent.post("/items").send(item)
    expect(insertFirstItem.status).toEqual(201)

  
    const insertSecondItem = await agent.post("/items").send(item)
    expect(insertSecondItem.status).toEqual(409)
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {

    const {status} = await agent.get("/items")
    const items = await prisma.items.findMany()

    
    expect(status).toEqual(200)
    expect(items).toBeInstanceOf(Array)


  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () =>{
    const id = 48
    const {status} = await agent.get(`/items/${id}`)
    expect(status).toEqual(200)
   
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
  const id = 43

  const {status} = await agent.get(`/items/${id}`)
  expect(status).toEqual(404)

  });
});

afterAll(async () => {
  await prisma.$disconnect();
});