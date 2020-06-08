// setup materialize components
document.addEventListener('DOMContentLoaded', function () {
	// モーダル開閉
	var modals = document.querySelectorAll('.modal');
	M.Modal.init(modals);

	// アコーディオン開閉
	var items = document.querySelectorAll('.collapsible');
	M.Collapsible.init(items);
});
