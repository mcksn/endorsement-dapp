var Endorsement = artifacts.require("./Endorsement.sol");

//test suite
contract('EndorsementTest', function (accounts) {
	var app;

	var alice = accounts[0];
	var bob = accounts[1];
	var charlie = accounts[2];

	beforeEach(async function () {
		app = await Endorsement.new();
	});

	it("joinNetwork", async () => {

		await app.joinNetwork("Alice", { from: accounts[0] });

		app.Joined({}, function (error, event) {
			assert.equal(event.returnValues._name, "Bob");
		}); //dont bother stop wathcing

		await app.joinNetwork("Bob", { from: accounts[1] });

		assert.equal(await app.fetchName(alice), "Alice");
		assert.equal(await app.fetchName(bob), "Bob");
	});

	it("endorse", async () => {

		await app.joinNetwork("Alice", { from: alice });
		await app.joinNetwork("Bob", { from: bob });
		await app.joinNetwork("Charlie", { from: charlie });

		await app.endorse(charlie, "my message", { from: bob });
		await app.endorse(charlie, "my message", { from: bob });
		await app.endorse(alice, "my message", { from: charlie });

		app.EndorsementMade({}, function (error, event) {
			assert.equal(event.returnValues._receiver, bob);
			assert.equal(event.returnValues._sender, alice);
			assert.equal(event.returnValues._message, "my message");
		}); //dont bother stop wathcing

		await app.endorse(bob, "my message", { from: alice });

		profileC = await app.fetchProfile(charlie)

		assert.equal(profileC[0].toNumber(), 1);
		assert.equal(profileC[1] / 1000000000, 1);
		assert.equal(profileC[2].toNumber(), 2);
		assert.deepEqual(profileC[3].toNumber() / 1000000000, 1.5);

		profileB = await app.fetchProfile(bob)

		assert.equal(profileB[0].toNumber(), 2);
		assert.equal(profileB[1] / 1000000000, 0.5);
		assert.equal(profileB[2].toNumber(), 1);
		assert.deepEqual(profileB[3].toNumber() / 1000000000, 1);

		profileA = await app.fetchProfile(alice)

		assert.equal(profileA[0].toNumber(), 1);
		assert.equal(profileA[1] / 1000000000, 1);
		assert.equal(profileA[2].toNumber(), 1);
		assert.deepEqual(profileA[3].toNumber() / 1000000000, 1);

	});


});
