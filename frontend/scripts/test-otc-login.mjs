/**
 * OTC 登入流程完整 E2E 驗證
 * 步驟 1: POST /api/auth/login → 取得 One-Time Code + redirect_url
 * 步驟 2: GET /api/auth/callback?code=xxx → 換 Token + 設 cookie
 * 步驟 3: GET /api/auth/me → 驗證 session 有效
 */
const STAGING = 'https://jhtour.staging.ai-go.app';
const LOCAL = 'http://localhost:3000';
const BASE = STAGING; // 切這裡測 staging 或 local

async function main() {
  console.log(`\n🔐 OTC 登入流程驗證`);
  console.log(`   Target: ${BASE}`);
  console.log('─'.repeat(50));

  // Step 1: Launch — 取得 One-Time Code
  console.log('\n📋 Step 1: POST /api/auth/login → 產生 OTC');
  let code, redirectUrl;
  try {
    const res = await fetch(`${BASE}/api/auth/login`, { method: 'POST' });
    const body = await res.text();
    console.log(`   HTTP ${res.status}`);
    console.log(`   Body: ${body.substring(0, 300)}`);
    
    if (!res.ok) {
      console.log(`   ❌ 失敗: ${body.substring(0, 200)}`);
      return;
    }
    
    const json = JSON.parse(body);
    code = json.code;
    redirectUrl = json.redirect_url;
    console.log(`   ✅ Code: ${code}`);
    console.log(`   ✅ Redirect URL: ${redirectUrl}`);
    console.log(`   ✅ Expires In: ${json.expires_in}s`);
  } catch (err) {
    console.log(`   ❌ 網路錯誤: ${err.message}`);
    return;
  }

  if (!code) { console.log('   ❌ 無法取得 code'); return; }

  // Step 2: Exchange — Code 換 Token
  console.log('\n📋 Step 2: GET /api/auth/callback?code=xxx → 換 Token');
  try {
    const res = await fetch(`${BASE}/api/auth/callback?code=${code}`, {
      redirect: 'manual', // 不自動跟隨重導，手動檢查
    });
    console.log(`   HTTP ${res.status}`);
    
    // 應收到 307 重導到 /
    const location = res.headers.get('location');
    const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    
    console.log(`   Location: ${location}`);
    console.log(`   Set-Cookie 數量: ${setCookies.length}`);
    
    let aigoToken = null;
    let aigoUser = null;
    for (const c of setCookies) {
      if (c.startsWith('aigo_token=')) {
        aigoToken = c.split('=')[1]?.split(';')[0];
        console.log(`   ✅ aigo_token: ${aigoToken?.substring(0, 30)}...`);
      }
      if (c.startsWith('aigo_user=')) {
        const raw = c.split('aigo_user=')[1]?.split(';')[0];
        try {
          aigoUser = JSON.parse(decodeURIComponent(raw));
          console.log(`   ✅ aigo_user: ${JSON.stringify(aigoUser).substring(0, 200)}`);
        } catch {
          console.log(`   ⚠️ aigo_user: (解析失敗) ${raw?.substring(0, 100)}`);
        }
      }
    }

    if (res.status === 307 || res.status === 308 || res.status === 302 || res.status === 301) {
      console.log(`   ✅ 重導正確 → ${location}`);
    } else if (res.status === 200) {
      // 如果直接回 200，讀 body
      const body = await res.text();
      console.log(`   Body: ${body.substring(0, 300)}`);
    } else {
      const body = await res.text();
      console.log(`   ❌ 非預期狀態: ${body.substring(0, 200)}`);
    }

    // Step 3: Session 驗證
    if (aigoToken) {
      console.log('\n📋 Step 3: GET /api/auth/me → 驗證 Session');
      const meRes = await fetch(`${BASE}/api/auth/me`, {
        headers: { 'Cookie': `aigo_token=${aigoToken}; aigo_user=${encodeURIComponent(JSON.stringify(aigoUser))}` },
      });
      const meBody = await meRes.text();
      console.log(`   HTTP ${meRes.status}`);
      console.log(`   Body: ${meBody.substring(0, 300)}`);
      
      if (meRes.ok) {
        const me = JSON.parse(meBody);
        console.log(`   ✅ Session 有效！`);
        console.log(`   ✅ authenticated: ${me.authenticated}`);
        console.log(`   ✅ user: ${JSON.stringify(me.user).substring(0, 200)}`);
      } else {
        console.log(`   ❌ Session 驗證失敗`);
      }

      // Step 4: Token Refresh
      console.log('\n📋 Step 4: POST /api/auth/refresh → Token 刷新');
      const refreshRes = await fetch(`${BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Cookie': `aigo_token=${aigoToken}` },
      });
      const refreshBody = await refreshRes.text();
      console.log(`   HTTP ${refreshRes.status}`);
      console.log(`   Body: ${refreshBody.substring(0, 300)}`);

      // Step 5: Logout
      console.log('\n📋 Step 5: DELETE /api/auth/me → 登出');
      const logoutRes = await fetch(`${BASE}/api/auth/me`, {
        method: 'DELETE',
        headers: { 'Cookie': `aigo_token=${aigoToken}` },
      });
      const logoutBody = await logoutRes.text();
      console.log(`   HTTP ${logoutRes.status}`);
      console.log(`   Body: ${logoutBody}`);
      
      // 驗證登出後 session 已清除
      const afterLogout = await fetch(`${BASE}/api/auth/me`);
      console.log(`   登出後 /me: HTTP ${afterLogout.status} (預期 401)`);
    } else {
      console.log('\n   ⚠️ 無 token，跳過 Step 3-5');
    }

  } catch (err) {
    console.log(`   ❌ 錯誤: ${err.message}`);
  }

  console.log('\n' + '═'.repeat(50));
  console.log('🏁 OTC 登入流程驗證完成');
}

main().catch(console.error);
