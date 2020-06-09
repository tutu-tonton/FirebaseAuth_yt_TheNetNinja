// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

//========================================
//  setup UI
//  メニューバー：ログインしている時・してない時で表示変える
//  アカウント情報： ユーザー作成時に一言bioがfirestore内に作成されてる。それを表示
//========================================
const setupUI = (user) => {
	if (user) {
		// account info
		// firestoreのユーザー情報を取りに行き、そのドキュメント情報を出力する
		db.collection('users')
			.doc(user.uid)
			.get()
			.then((doc) => {
				const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
      `;
				accountDetails.innerHTML = html;
			});
		// toggle UI elements
		loggedInLinks.forEach((item) => (item.style.display = 'block'));
		loggedOutLinks.forEach((item) => (item.style.display = 'none'));
	} else {
		// hide account info
		accountDetails.innerHTML = '';
		// toggle UI elements
		loggedInLinks.forEach((item) => (item.style.display = 'none'));
		loggedOutLinks.forEach((item) => (item.style.display = 'block'));
	}
};

//========================================
//  setup guides
//  ログインしているときはそのデータでdom作る
//
//========================================
// data = snapshot.docs
const setupGuides = (data) => {
	// ログインしてるときは　data.length = true
	if (data.length) {
		let html = '';
		// 個別のドキュメントに対して...
		data.map((doc) => {
			// ドキュメントのデータ部分オブジェクト
			// {title: xxx, content: xxx}
			const guide = doc.data();
			const li = `
    <li>
      <div class="collapsible-header grey lighten-4">${guide.title}</div>
      <div class="collapsible-body white">${guide.content}</div>
    </li>
    `;
			html += li;
		});
		guideList.innerHTML = html;
	} else {
		// ログインしていないときは
		guideList.innerHTML = '<h5 class="center-align">Login to view guides</h5>';
	}
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {
	// モーダル開閉
	var modals = document.querySelectorAll('.modal');
	M.Modal.init(modals);

	// アコーディオン開閉
	var items = document.querySelectorAll('.collapsible');
	M.Collapsible.init(items);
});
