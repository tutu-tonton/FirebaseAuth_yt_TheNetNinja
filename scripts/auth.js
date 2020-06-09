//========================================
//  firestoreからのデータを表示
//  setupGuidesメソッドはindex.jsにあり
//  -> ログインしている場合のみ、データを取得して表示。ログインしていなければ見せないように
//  onAuthStateChangedメソッドに組みこみ
//========================================

//========================================
//  listen for auth status changes
//  onAuthStateChanged(): authの状態を変更するようなイベント
//  ログイン状態なら userオブジェクト が返ってくる
//  user.displayName, user.email
//  ログアウト状態なら null が返ってくる
//  ログイン状態ならガイドアイテム表示、ナビメニューをログイン仕様に
//  onSnapshot(): スナップショットが変更されるようなイベント
//  常時listenするようになるので、データ追加しようとすると即時反映されるようになる
//========================================
auth.onAuthStateChanged((user) => {
	if (user) {
		// console.log('user logged in: ', user);
		// ログインユーザーがadminかどうか確認
		user.getIdTokenResult().then((idTokenResult) => {
			// console.log(idTokenResult.claims.admin);  // adminならtrueが返ってくる
			user.admin = idTokenResult.claims.admin; // adminならtrue, 違うならfalse入る
			setupUI(user);
		});

		// firestoreからのデータを表示
		db.collection('guides')
			// .get().then()
			// realtime listenerにする
			.onSnapshot(
				(snapshot) => {
					setupGuides(snapshot.docs);
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		console.log('user logged out');
		// ログインしていなければ何も表示しないように
		setupGuides([]);
		setupUI();
	}
});

//========================================
// add admin cloud function
//
//
//
//========================================
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const adminEmail = document.querySelector('#admin-email').value;
	const addAdminRole = functions.httpsCallable('addAdminRole');
	addAdminRole({ email: adminEmail }).then((result) => {
		console.log(result);
	});
});

//========================================
//  signup with email&pass
//  ユーザー作成後に補足情報をfirestoreの方に保存する
//  auth: cred.user.uid を利用して
//  firestore: collection('user').doc(cred.user.uid) 新規ドキュメントを作成
//========================================
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();

	//  get user info
	const email = signupForm['signup-email'].value;
	const password = signupForm['signup-password'].value;

	//  sign up the user
	auth.createUserWithEmailAndPassword(email, password)
		.then((cred) => {
			// signupに成功するとtokenが返ってくる.
			// console.log(cred);
			// tokenの中のuserに入力したemail等が入っている
			// console.log(cred.user);
			// authからfirestoreへ
			// authのトークンに作成ユーザーのuniqueIDが入っている
			// そのIDをfirestore側でのドキュメントIDにして新規ドキュメント作成
			return db.collection('users').doc(cred.user.uid).set({
				bio: signupForm['signup-bio'].value,
			});
		})
		.then(() => {
			// 入力後にモーダル閉じる
			const modal = document.querySelector('#modal-signup');
			M.Modal.getInstance(modal).close();
			// 入力後に入力欄リセットする
			signupForm.reset();
			signupForm.querySelector('.error').innerHTML = '';
		})
		.catch((err) => {
			signupForm.querySelector('.error').innerHTML = err.message;
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

	auth.signInWithEmailAndPassword(email, password)
		.then((cred) => {
			// console.log(cred.user);
			// close the login modal and reset the form
			const modal = document.querySelector('#modal-login');
			M.Modal.getInstance(modal).close();
			loginForm.reset();
			loginForm.querySelector('.error').innerHTML = '';
		})
		.catch((err) => {
			loginForm.querySelector('.error').innerHTML = err.message;
		});
});

//========================================
//  create new guide
//  注意点！
//  ガイドの作成はログインしていないとできない。
//  ただし検証のElements欄には現れていて、display:noneを無効にすれば画面上に現れる
//  そこからログインしてなくてもガイドが作成できてしまう
//  -> firestore側でのセキュリティが大事!
//========================================
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
	e.preventDefault();

	db.collection('guides')
		.add({
			title: createForm['title'].value,
			content: createForm['content'].value,
		})
		.then(() => {
			// close the modal and reset form
			const modal = document.querySelector('#modal-create');
			M.Modal.getInstance(modal).close();
			createForm.reset();
		})
		.catch((err) => {
			console.log(err.message);
		});
});
