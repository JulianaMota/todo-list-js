const list = document.querySelector('ul');
const form = document.querySelector('[data-form=addTodo]');
const formSearch = document.querySelector('[data-form=searchTodo]');
const filters = document.querySelector('#filters');

//display todos
const addTodo = (todo, id) => {
	let date = String(todo.date.toDate()).slice(0, 15);
	let str;
	if (todo.important === true) {
		str = 'checked';
	}
	let html = `
	<li data-id="${id}">
		<div>
			<label for="imp" class="container">Important
			<input type="checkbox" id="imp" ${str}>
			<span class="checkmark"></span>
			<lable>
		</div>
		<input type="text" value="${todo.title}" class="todo-title">
        <textarea>${todo.description}</textarea>
		<p>${date}</p>
		<div>
			<button data-btn="edit" class="btn">Save Edition</button>
			<button data-btn="delete" class="btn">Delete</button>
		</div>
    </li>
    `;
	list.innerHTML += html;
};

//get todos
db.collection('todo').onSnapshot((snapshot) => {
	// console.log(snapshot.docChanges());
	snapshot.docChanges().forEach((change) => {
		const doc = change.doc;
		// console.log(change.type);
		if (change.type === 'added') {
			addTodo(doc.data(), doc.id);
		} else if (change.type === 'removed') {
			deleteToDo(doc.id);
		}
	});
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const now = new Date();
	const todo = {
		title: form.title.value,
		description: form.desc.value,
		important: form.important.checked,
		date: firebase.firestore.Timestamp.fromDate(now)
	};

	db
		.collection('todo')
		.add(todo)
		.then(() => {
			console.log('todo added');
			form.title.value="";
			form.desc.value="";
			from.important.checked=false;
		})
		.catch((err) => {
			console.log(err);
		});

});

//delete data
list.addEventListener('click', (e) => {
	if (e.target.dataset.btn === 'delete') {
		const id = e.target.parentElement.parentElement.getAttribute('data-id');
		db.collection('todo').doc(id).delete().then(() => {
			console.log('todo deleted');
		});
	}
});

//delete todo form html
const deleteToDo = (id) => {
	const todos = document.querySelectorAll('li');
	todos.forEach((todo) => {
		if (todo.getAttribute('data-id') === id) {
			todo.remove();
		}
	});
};

//update data
list.addEventListener('click', (e) => {
	if (e.target.dataset.btn === 'edit') {
		const id = e.target.parentElement.parentElement.getAttribute('data-id');
		const now = new Date();
		const todo = {
			title: e.target.parentElement.parentElement.children[1].value,
			description: e.target.parentElement.parentElement.children[2].value,
			important: e.target.parentElement.parentElement.children[0].children[0].children[0].checked,
			date: firebase.firestore.Timestamp.fromDate(now)
		};

		db
			.collection('todo')
			.doc(id)
			.update(todo)
			.then(() => {
				console.log('todo updated');
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

//search todo
formSearch.addEventListener('keyup', (e) => {
	e.preventDefault();
	const todos = document.querySelectorAll('li');
	const title = formSearch.search.value.toUpperCase();

	todos.forEach((todo) => {
		if (todo.children[1].value.toUpperCase().indexOf(title) >= 0) {
			todo.style.display = 'grid';
		} else {
			todo.style.display = 'none';
		}
	});
});

//filters
filters.addEventListener('click', (e) => {
	const todos = document.querySelectorAll('li');

	todos.forEach((todo) => {
		console.log(e.target.dataset.btn === 'imp');
		if(e.target.dataset.btn === 'imp') {
			if (!todo.children[0].children[0].children[0].checked) {
				todo.style.display = 'none';
			}
		} else if (e.target.dataset.btn === 'all') {
			todo.style.display = 'grid';
		}
	});
});
