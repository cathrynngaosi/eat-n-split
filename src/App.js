import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriends(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriends} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name} </h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}{" "}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}{" "}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [friendImg, setFriendImg] = useState("https://i.pravatar.cc/48");

  function handleSubmitForm(e) {
    e.preventDefault();

    if (!friendImg || !friendName) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name: friendName,
      image: `${friendImg}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setFriendName("");
    setFriendImg("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmitForm}>
      <label> 👯‍♀️ Friend name: </label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />

      <label> 🌠 Image URL: </label>
      <input
        type="text"
        value={friendImg}
        onChange={(e) => setFriendImg(e.target.value)}
      />

      <Button> Add </Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [ownExpense, setOwnExpense] = useState("");
  const [selectPayor, setSelectPayor] = useState("user");
  let friendExpense = bill ? bill - ownExpense : "";

  function handleSubmitForm(e) {
    e.preventDefault();

    if (!bill || !ownExpense) return;

    if (selectPayor === "user") {
      onSplitBill(friendExpense);
    } else {
      onSplitBill(-ownExpense);
    }
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmitForm}>
      <h2> Split a bill with {selectedFriend.name} </h2>

      <label> 💰 Bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label> 🧍🏻‍♂️ Your expense </label>
      <input
        type="text"
        value={ownExpense}
        onChange={(e) =>
          setOwnExpense(
            Number(e.target.value) > bill ? ownExpense : Number(e.target.value)
          )
        }
      />

      <label> 👯‍♀️ {selectedFriend.name}'s expense </label>
      <input type="text" disabled value={friendExpense} />

      <label> 🤑 Who is paying the bill </label>
      <select
        value={selectPayor}
        onChange={(e) => setSelectPayor(e.target.value)}
      >
        <option value="user"> You</option>
        <option value="friend"> {selectedFriend.name} </option>
      </select>

      <Button> Split Bill </Button>
    </form>
  );
}
