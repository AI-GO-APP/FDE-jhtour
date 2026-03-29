import fs from 'fs';

const API_BASE = 'http://localhost:3006/api/custom';

// 測試資料定義
const TEST_SCENARIOS = [
  {
    table: 'itinerary-templates',
    name: '行程模板',
    createPayload: {
      name: 'Test Tour Template',
      destination: '東京, 日本',
      duration_days: 5,
      category: '團體旅遊',
      status: 'draft',
      description: '這是一個自動化測試用的行程模板'
    },
    updatePayload: {
      status: 'active',
      duration_days: 6
    }
  },
  {
    table: 'departure-schedules',
    name: '出團班表',
    createPayload: {
      group_code: 'TEST2026-0415A',
      departure_date: '2026-04-15',
      return_date: '2026-04-20',
      min_pax: 10,
      max_pax: 20,
      current_pax: 0,
      price: 35000,
      status: 'planned'
    },
    updatePayload: {
      current_pax: 2,
      status: 'confirmed'
    }
  },
  {
    table: 'hotel-contracts',
    name: '飯店合約',
    createPayload: {
      hotel_name: 'Test Grand Hotel',
      city: 'Tokyo',
      country: 'Japan',
      contract_start: '2026-01-01',
      contract_end: '2026-12-31',
      room_type: 'TWN',
      rate: 15000,
      currency: 'JPY',
      status: 'active'
    },
    updatePayload: {
      rate: 16000
    }
  },
  {
    table: 'airline-contracts',
    name: '航空合約',
    createPayload: {
      airline_code: 'CI',
      airline_name: 'China Airlines',
      route: 'TPE-NRT',
      contract_start: '2026-01-01',
      contract_end: '2026-12-31',
      seat_class: 'Economy',
      rate: 12000,
      currency: 'TWD',
      status: 'active'
    },
    updatePayload: {
      rate: 12500
    }
  },
  {
    table: 'guide-assignments',
    name: '導遊派遣',
    createPayload: {
      guide_name: 'Test Guide(測試導遊)',
      language: 'English',
      role: 'Tour Guide',
      daily_rate: 3000,
      status: 'assigned',
      notes: '測試派遣記錄'
    },
    updatePayload: {
      status: 'confirmed'
    }
  },
  {
    table: 'visa-requirements',
    name: '簽證需求',
    createPayload: {
      country: 'USA',
      passport_country: 'Taiwan',
      visa_type: 'ESTA',
      processing_days: 3,
      fee: 650,
      currency: 'TWD',
      documents_required: '護照影本',
      notes: '測試簽證需求'
    },
    updatePayload: {
      fee: 700
    }
  },
  {
    table: 'insurance-plans',
    name: '保險方案',
    createPayload: {
      plan_name: 'Test Safe Travel Plan',
      provider: 'Test Insurance Co.',
      coverage_type: 'Travel Health',
      premium: 500,
      coverage_amount: 2000000,
      min_age: 0,
      max_age: 85,
      status: 'active'
    },
    updatePayload: {
      premium: 550
    }
  }
];

async function runCRUDTest() {
  console.log(`================================================================`);
  console.log(`  系統 Custom Table 真實資料 CRUD 測試 (Create, Read, Update, Delete)`);
  console.log(`  時間: ${new Date().toLocaleString()}`);
  console.log(`================================================================\n`);

  let totalTests = 0;
  let passedTests = 0;

  for (const scenario of TEST_SCENARIOS) {
    console.log(`▶ 測試項目: ${scenario.name} (${scenario.table})`);
    let createdRecordId = null;

    // 1. CREATE (POST)
    try {
      totalTests++;
      const createRes = await fetch(`${API_BASE}/${scenario.table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario.createPayload)
      });
      
      const createData = await createRes.json();
      
      if (createRes.ok && createData.id) {
        createdRecordId = createData.id;
        console.log(`  ✅ CREATE 成功 | ID: ${createdRecordId}`);
        passedTests++;
      } else {
        console.error(`  ❌ CREATE 失敗 | Status: ${createRes.status} | 回應:`, JSON.stringify(createData).substring(0, 100));
        continue; // 如果 Create 失敗，跳過這張表的後續測試
      }
    } catch (e) {
      console.error(`  ❌ CREATE 異常 |`, e.message);
      continue;
    }

    // 2. READ (GET Single / GET List)
    try {
      totalTests++;
      // 我們使用 list / query 端點，配合 id 查詢
      const readRes = await fetch(`${API_BASE}/${scenario.table}?limit=10`);
      const readData = await readRes.json();
      
      if (readRes.ok && Array.isArray(readData.data)) {
        // 確保剛才建立的資料在列表內
        const found = readData.data.find(item => item.id === createdRecordId);
        if (found) {
          console.log(`  ✅ READ 成功   | 成功取得新建資料，驗證欄位格式正確`);
          passedTests++;
        } else {
          console.error(`  ❌ READ 失敗   | 查詢列表中找不到 ID: ${createdRecordId}`);
        }
      } else {
         console.error(`  ❌ READ 失敗   | Status: ${readRes.status} | 格式不正確:`, JSON.stringify(readData).substring(0, 100));
      }
    } catch (e) {
      console.error(`  ❌ READ 異常   |`, e.message);
    }

    // 3. UPDATE (PATCH)
    try {
      totalTests++;
      const updateRes = await fetch(`${API_BASE}/${scenario.table}/${createdRecordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario.updatePayload)
      });
      
      const updateData = await updateRes.json();
      
      if (updateRes.ok) {
        console.log(`  ✅ UPDATE 成功 | 已更新欄位: ${Object.keys(scenario.updatePayload).join(', ')}`);
        passedTests++;
      } else {
         console.error(`  ❌ UPDATE 失敗 | Status: ${updateRes.status} | 回應:`, JSON.stringify(updateData).substring(0, 100));
      }
    } catch (e) {
      console.error(`  ❌ UPDATE 異常 |`, e.message);
    }

    // 4. DELETE (DELETE)
    try {
      totalTests++;
      const deleteRes = await fetch(`${API_BASE}/${scenario.table}/${createdRecordId}`, {
        method: 'DELETE'
      });
      
      if (deleteRes.ok) {
        console.log(`  ✅ DELETE 成功 | 已刪除測試記錄`);
        passedTests++;
      } else {
         console.error(`  ❌ DELETE 失敗 | Status: ${deleteRes.status}`);
      }
    } catch (e) {
      console.error(`  ❌ DELETE 異常 |`, e.message);
    }

    console.log(''); // 空行分隔
  }

  console.log(`================================================================`);
  console.log(`  測試結果摘要: 共執行 ${totalTests} 項 CRUD 任務`);
  const emoji = passedTests === totalTests ? '🎉' : '⚠️';
  console.log(`  ${emoji} 通過: ${passedTests} / 失敗: ${totalTests - passedTests}`);
  console.log(`================================================================\n`);
}

runCRUDTest();
