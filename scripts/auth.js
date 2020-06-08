//========================================
//  firestoreからのデータを表示
//  setupGuidesメソッドはindex.jsにあり
//
//========================================
db.collection('guides')
	.get()
	.then((snapshot) => {
		setupGuides(snapshot.docs);
	});

//========================================
//  listen for auth status changes
//  onAuthStateChanged(): authの状態を変更するようなイベント
//  ログイン状態なら user が返ってくる
//  ログアウト状態なら null が返ってくる
//========================================
auth.onAuthStateChanged((user) => {
	if (user) {
		console.log('user logged in: ', user);
	} else {
		console.log('user logged out');
	}
});

//========================================
//  signup with email&pass
//
//
//
//========================================
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();

	//  get user info
	const email = signupForm['signup-email'].value;
	const password = signupForm['signup-password'].value;

	//  sign up the user
	auth.createUserWithEmailAndPassword(email, password).then((cred) => {
		// signupに成功するとtokenが返ってくる.
		// console.log(cred);
		// tokenの中のuserに入力したemail等が入っている
		console.log(cred.user);

		// 入力後にモーダル閉じる
		const modal = document.querySelector('#modal-signup');
		M.Modal.getInstance(modal).close();
		// 入力後に入力欄リセットする
		signupForm.reset();
	});
});

//========================================
//  logout
//
//
//========================================
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
	e.preventDefault();
	auth.signOut();
	// ちゃんとサインアウトできてるか確認用
	// auth.signOut().then(() => {
	// 	console.log('user signed out');
	// });
});

//========================================
//  login
//
//
//========================================

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();

	//get user info
	const email = loginForm['login-email'].value;
	const password = loginForm['login-password'].value;

	auth.signInWithEmailAndPassword(email, password).then((cred) => {
		// console.log(cred.user);
		// close the login modal and reset the form
		const modal = document.querySelector('#modal-login');
		M.Modal.getInstance(modal).close();
		loginForm.reset();
	});
});
