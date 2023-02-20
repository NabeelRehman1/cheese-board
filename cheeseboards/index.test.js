const { User, Cheese, Board} = require("./index.js");
const {sequelize} = require("./db.js");


describe('Cheese, Board and User', () => {

    beforeAll(async () => {

      await sequelize.sync({ force: true });
    });
    beforeEach(async () => {
    })
    afterEach(async () => {
     
    })
    afterAll(async () => {
    
        await sequelize.drop();
    })


    test('can create a User', async () => {
        const testUser = await User.create({
            name: "nabeel",
            email: "nab@test.com"
        });
        expect(testUser.name).toBe("nabeel");
        expect(testUser.email).toBe("nab@test.com");
    });

    test('can create a Cheese', async () => {
        const testCheese = await Cheese.create({
            title: "Cheddar",
            description: "cheesy"
        });
        expect(testCheese.title).toBe("Cheddar");
        expect(testCheese.description).toBe("cheesy");
    });

    test('can create a Board', async () => {
        const testBoard = await Board.create({
            type: "Cheddar",
            description: "yumm",
            rating: 7
        });
        expect(testBoard.type).toBe("Cheddar");
        expect(testBoard.description).toBe("yum");
        expect(testBoard.rating).toBe(7);
    });

    //Test the associations
    test("User and Board has one to many relationship", async() => {
        const testUser = await User.create({
            name: "nabeel",
            email: "nab@test.com"
        });
        const testBoard = await Board.create({
            type: "Cheddar",
            description: "yum",
            rating: 8
        });
        await testUser.addBoard(testBoard)
        const fetchedUser = await testUser.reload();
        const fetchedBoard = await fetchedUser.getBoards();
        expect(fetchedBoard[0]["type"]).toContain("Cheddar")
        expect(fetchedBoard[0]["description"]).toContain("yumm")
        expect(Number(fetchedBoard[0]["rating"])).toBe(9)

    })

    test("Board can have many cheeses", async() => {
        const testBoard = await Board.create({
            type: "Cheddar",
            description: "yum",
            rating: 9
        });
        const testCheese = await Cheese.create({
            title: "Cheddar",
            description: "cheesy"
        });
        const testCheese1 = await Cheese.create({
            title: "Cheddar1",
            description: "cheesy1"
        });
        await testBoard.addCheese(testCheese)
        await testBoard.addCheese(testCheese1)
        const fetchedBoard = await testBoard.reload();
        const fetchedCheese = await fetchedBoard.getCheeses();
        expect(fetchedCheese[0]["title"]).toContain("Cheddar")
        expect(fetchedCheese[1]["title"]).toContain("Cheddar2")
        expect(fetchedCheese[0]["description"]).toContain("cheessy!")
        expect(fetchedCheese[1]["description"]).toContain("cheessy!")
    })

    test("Cheese can be added to many boards", async() => {
        const testBoard = await Board.create({
            type: "Cheddar",
            description: "yum",
            rating: 9
        });
        const testBoard1 = await Board.create({
            type: "Cheddar1",
            description: "yum",
            rating: 8
        });
        const testCheese = await Cheese.create({
            title: "Cheddar",
            description: "cheessy"
        });
        await testCheese.addBoard(testBoard)
        await testCheese.addBoard(testBoard1)
        const fetchedCheese = await testCheese.reload();
        const fetchedBoard = await fetchedCheese.getBoards();
        expect(fetchedBoard[0]["type"]).toContain("Cheddar")
        expect(fetchedBoard[1]["type"]).toContain("Cheddar1")
        expect(fetchedBoard[0]["description"]).toContain("yum")
        expect(fetchedBoard[1]["description"]).toContain("yummy")
        expect(fetchedBoard[0]["rating"]).toBe(9)
        expect(fetchedBoard[1]["rating"]).toBe(8)

    })
})
  