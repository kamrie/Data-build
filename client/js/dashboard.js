window.addEventListener("DOMContentLoaded", () => {
  getWallet();
});

// const hamburger = document.querySelector("#toggle-btn");
// hamburger.addEventListener("click", () => {
//     document.querySelector("#sidebar").classList.toggle("expand")
// })

// side bar logic
const sidebar   = document.querySelector('#sidebar');
const overlay   = document.getElementById('sbOverlay');
const toggleBtn = document.querySelector('#toggle-btn');
const sbClose   = document.getElementById('sbCloseBtn');

function openSidebar() {
  sidebar.classList.remove('closed');
  overlay.classList.remove('hidden');
}

function closeSidebar() {
  sidebar.classList.add('closed');
  overlay.classList.add('hidden');
}

// Simple toggle 
toggleBtn.addEventListener('click', () => {
  sidebar.classList.contains('closed') ? openSidebar() : closeSidebar();
});

sbClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Close on mobile when a nav link is clicked
document.querySelectorAll('#sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 900) closeSidebar();
  });
});


//OPENING THE MODAL LOGIC
// ── MODAL OPEN / CLOSE ──
function openFundModal() {
  document.getElementById('amount').value = '';
  updateFeePreview(0);
  document.querySelectorAll('.qa-chip').forEach(c => {
    c.style.background = '';
    c.style.borderColor = '';
    c.style.color = '';
    c.style.fontWeight = '';
  });

  const modal = document.getElementById('fundModal');
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'all';
  modal.querySelector('.modal-card').style.transform = 'translateY(0)';

  setTimeout(() => document.getElementById('amount').focus(), 300);
}

function closeFundModal() {
  const modal = document.getElementById('fundModal');
  modal.querySelector('.modal-card').style.transform = 'translateY(40px)';
  setTimeout(() => {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }, 300);
}

// ── FEE PREVIEW ──
function updateFeePreview(amount) {
  const fee   = Math.round(amount * 0.015 * 100) / 100;
  const total = amount + fee;
  document.getElementById('feeDisp').textContent = `₦${total > 0 ? fee.toLocaleString('en-NG', {minimumFractionDigits:2}) : '0.00'}`;
  document.getElementById('totDisp').textContent = `₦${total > 0 ? total.toLocaleString('en-NG', {minimumFractionDigits:2}) : '0.00'}`;
}

// ── QUICK CHIPS ──
document.getElementById('qaRow').addEventListener('click', e => {
  const chip = e.target.closest('.qa-chip');
  if (!chip) return;
  const val = parseFloat(chip.dataset.v);
  document.getElementById('amount').value = val;
  updateFeePreview(val);
  // reset all chips then highlight selected
  document.querySelectorAll('.qa-chip').forEach(c => {
    c.style.background = ''; c.style.borderColor = '';
    c.style.color = ''; c.style.fontWeight = '';
  });
  chip.style.background   = '#FFD600';
  chip.style.borderColor  = '#FFD600';
  chip.style.color        = '#000';
  chip.style.fontWeight   = '700';
});

// live fee update as user types
document.getElementById('amount').addEventListener('input', e => {
  updateFeePreview(parseFloat(e.target.value) || 0);
  document.querySelectorAll('.qa-chip').forEach(c => {
    c.style.background = ''; c.style.borderColor = '';
    c.style.color = ''; c.style.fontWeight = '';
  });
});

// ── BUTTON LISTENERS ──
document.getElementById('openFundModal').addEventListener('click', openFundModal);
document.getElementById('closeFundModal').addEventListener('click', closeFundModal);
document.getElementById('cancelFund').addEventListener('click', closeFundModal);

// close on backdrop click
document.getElementById('fundModal').addEventListener('click', e => {
  if (e.target === document.getElementById('fundModal')) closeFundModal();
});

// ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeFundModal();
});








const fundBtn = document.getElementById("fundBtn");

    // 🔐 TEST PROTECTED ROUTE
  async function getWallet() {
    try {
        const walletRes = await fetch('http://localhost:3500/api/user/wallet', {
            method: 'GET',
            credentials: 'include'
            });

            const walletData = await walletRes.json();
            console.log("Wallet:", walletData.wallet);

            const balance = Number(walletData.wallet.balance).toLocaleString();     
            document.getElementById("balance").textContent =
              `Balance: ₦${balance}`;
    } catch (err) {
        console.log("Error fetching wallet:", err)
    }
}

fundBtn.addEventListener("click", async () => {
  const amount = document.getElementById("amount").value;

  try {
    const res = await fetch('http://localhost:3500/api/user/wallet/fund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', //  VERY IMPORTANT
      body: JSON.stringify({ amount: Number(amount) })
    });

    const data = await res.json();

    console.log(data);
    alert(data.message);

    // Refresh wallet balance
    getWallet();

  } catch (err) {
    console.log("Funding error:", err);
  }
});