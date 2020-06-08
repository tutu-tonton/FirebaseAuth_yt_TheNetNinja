// DOM elements
const guideList = document.querySelector('.guides');

//========================================
//  setup guides
//
//
//========================================
// data = snapshot.docs
const setupGuides = (data) => {
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
