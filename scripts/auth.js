// signup with email&pass
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// ge user info
	const email = signupForm['signup-email'].value;
	const password = signupForm['signup-password'].value;

	//sign up the user
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
