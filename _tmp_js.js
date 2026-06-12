
        var currentState = 'unauthenticated';
        var pendingHouseData = null;
        var authenticatedHouseData = null;

        var houseData = {
            community: '阳光花园',
            phase: '二期',
            building: '3栋',
            unit: '2单元',
            floor: '12层',
            room: '1203号',
            note: '我是业主，这是我的房产证编号：F-2024001'
        };

        var members = [
            { name: '张明', role: '户主', tag: 'owner', phone: '138****5678' },
            { name: '李芳', role: '配偶', tag: 'family', phone: '139****8901' },
            { name: '张小雨', role: '子女', tag: 'family', phone: '' },
            { name: '陈伟', role: '租客', tag: 'tenant', phone: '185****3456' }
        ];

        var goldDetails = [
            { time: '2026-05-30 14:30', desc: '线上购物奖励（订单¥358）', amount: '+¥5.37', type: 'plus' },
            { time: '2026-05-29 18:20', desc: '线下扫码支付奖励（¥120）', amount: '+¥1.20', type: 'plus' },
            { time: '2026-05-28 10:15', desc: '线上购物奖励（订单¥990）', amount: '+¥14.85', type: 'plus' },
            { time: '2026-05-27 16:45', desc: '缴纳物业费抵扣', amount: '-¥50.00', type: 'minus' },
            { time: '2026-05-26 12:30', desc: '线下扫码支付奖励（¥85）', amount: '+¥0.85', type: 'plus' },
            { time: '2026-05-25 09:00', desc: '平台活动赠送', amount: '+¥20.00', type: 'plus' }
        ];

        var communityOptions = ['阳光花园', '翡翠湾', '碧桂园', '绿城玫瑰园'];
        var phaseOptions = ['一期', '二期', '三期'];
        var buildingOptions = ['1栋', '2栋', '3栋', '4栋', '5栋'];
        var unitOptions = ['1单元', '2单元', '3单元'];
        var floorOptions = [];
        for (var i = 1; i <= 33; i++) floorOptions.push(i + '层');
        var roomOptions = [];
        for (var i = 1; i <= 6; i++) {
            var prefix = (1200 + i).toString();
            roomOptions.push(prefix + '号');
        }

        var pickerValues = {
            community: '',
            phase: '',
            building: '',
            unit: '',
            floor: '',
            room: ''
        };

        function generateSelect(name, options, placeholder) {
            var selected = pickerValues[name] || '';
            var html = '<select class="form-select" id="pick_' + name + '" onchange="onPickerChange(\'' + name + '\')">';
            html += '<option value="">' + placeholder + '</option>';
            for (var i = 0; i < options.length; i++) {
                var opt = options[i];
                html += '<option value="' + opt + '"' + (selected === opt ? ' selected' : '') + '>' + opt + '</option>';
            }
            html += '</select>';
            return html;
        }

        function onPickerChange(name) {
            var el = document.getElementById('pick_' + name);
            pickerValues[name] = el ? el.value : '';

            if (name === 'community') {
                pickerValues.phase = '';
            }
            if (name === 'community' || name === 'phase') {
                pickerValues.building = '';
            }
            if (name === 'community' || name === 'phase' || name === 'building') {
                pickerValues.unit = '';
            }
            if (name === 'community' || name === 'phase' || name === 'building' || name === 'unit') {
                pickerValues.floor = '';
            }
            if (name !== 'room') {
                pickerValues.room = '';
            }

            if (currentState === 'unauthenticated' || currentState === 'modifying') {
                renderAuthPage(currentState === 'modifying');
            }
        }

        function renderAuthPage(isModify) {
            var html = '';
            html += '<div class="section-card">';
            html += '<div class="section-title">' + (isModify ? '修改认证信息' : '认证你的房屋') + '</div>';
            html += '<div class="section-subtitle">' + (isModify ? '修改认证信息需重新审核' : '选择你所在的房屋位置，提交审核后即可完成认证') + '</div>';

            html += '<div class="form-group"><label class="form-label">小区</label>';
            html += generateSelect('community', communityOptions, '请选择小区');
            html += '</div>';

            html += '<div class="form-group"><label class="form-label">期数</label>';
            html += generateSelect('phase', phaseOptions, '请选择期数');
            html += '</div>';

            html += '<div class="cascade-row">';
            html += '<div class="form-group"><label class="form-label">楼栋</label>';
            html += generateSelect('building', buildingOptions, '请选择楼栋');
            html += '</div>';
            html += '<div class="form-group"><label class="form-label">单元</label>';
            html += generateSelect('unit', unitOptions, '请选择单元');
            html += '</div>';
            html += '</div>';

            html += '<div class="cascade-row">';
            html += '<div class="form-group"><label class="form-label">层数</label>';
            html += generateSelect('floor', floorOptions, '请选择层数');
            html += '</div>';
            html += '<div class="form-group"><label class="form-label">房号</label>';
            html += generateSelect('room', roomOptions, '请选择房号');
            html += '</div>';
            html += '</div>';

            html += '<div class="form-group"><label class="form-label">住户姓名</label>';
            html += '<input type="text" class="form-input" id="residentName" placeholder="请输入住户姓名" value="' + (pickerValues.residentName || '') + '">';
            html += '</div>';

            html += '<div class="form-group"><label class="form-label">认证备注</label>';
            html += '<textarea class="form-textarea" id="authNote" placeholder="请填写认证说明，如：我是该房号的业主/住户...">' + (pickerValues.note || '') + '</textarea>';
            html += '</div>';

            if (isModify) {
                html += '<div style="display:flex;gap:10px;">';
                html += '<button class="btn btn-outline" style="flex:1;" onclick="switchState(\'authenticated\')">取消修改</button>';
                html += '<button class="btn btn-primary" style="flex:1;" onclick="submitModify()">提交修改</button>';
                html += '</div>';
            } else {
                html += '<button class="btn btn-primary" onclick="submitAuth()">提交审核</button>';
            }

            html += '</div>';

            if (!isModify) {
                html += '<div class="section-card"><div class="empty-state">';
                html += '<div class="empty-icon">🏘</div>';
                html += '<div class="empty-text">认证后可查看同住成员<br>及物业金信息</div>';
                html += '</div></div>';
            }

            document.getElementById('pageContent').innerHTML = html;
        }

        function submitAuth() {
            var allFilled = true;
            var keys = ['community', 'phase', 'building', 'unit', 'floor', 'room'];
            for (var i = 0; i < keys.length; i++) {
                if (!pickerValues[keys[i]]) { allFilled = false; break; }
            }
            if (!allFilled) {
                showToast('请完善所有房屋信息');
                return;
            }

            var noteEl = document.getElementById('authNote');
            var nameEl = document.getElementById('residentName');
            pickerValues.note = noteEl ? noteEl.value : '';
            pickerValues.residentName = nameEl ? nameEl.value : '';
            pendingHouseData = JSON.parse(JSON.stringify(pickerValues));

            currentState = 'reviewing';
            renderReviewPage();
            showToast('认证申请已提交，请等待审核');
        }

        function submitModify() {
            var allFilled = true;
            var keys = ['community', 'phase', 'building', 'unit', 'floor', 'room'];
            for (var i = 0; i < keys.length; i++) {
                if (!pickerValues[keys[i]]) { allFilled = false; break; }
            }
            if (!allFilled) {
                showToast('请完善所有房屋信息');
                return;
            }

            var noteEl = document.getElementById('authNote');
            var nameEl = document.getElementById('residentName');
            pickerValues.note = noteEl ? noteEl.value : '';
            pickerValues.residentName = nameEl ? nameEl.value : '';
            pendingHouseData = JSON.parse(JSON.stringify(pickerValues));

            currentState = 'modify_reviewing';
            renderModifyReviewPage();
            showToast('修改申请已提交，请等待审核');
        }

        function renderReviewPage() {
            var d = pendingHouseData;
            var html = '';
            html += '<div class="section-card">';
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">';
            html += '<div class="section-title" style="margin-bottom:0;">认证审核中</div>';
            html += '<span class="status-badge badge-pending">审核中</span>';
            html += '</div>';

            html += '<div class="house-info-display">';
            html += '<div class="house-info-row"><span class="house-info-label">小区</span><span class="house-info-value">' + d.community + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">期数</span><span class="house-info-value">' + d.phase + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">楼栋</span><span class="house-info-value">' + d.building + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">单元</span><span class="house-info-value">' + d.unit + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">层数</span><span class="house-info-value">' + d.floor + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">房号</span><span class="house-info-value">' + d.room + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">住户姓名</span><span class="house-info-value">' + (d.residentName || '未填写') + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">备注</span><span class="house-info-value">' + (d.note || '无') + '</span></div>';
            html += '</div>';

            html += '<div style="margin-top:14px;display:flex;gap:10px;">';
            html += '<button class="btn btn-outline btn-sm" onclick="openModal(\'cancelReviewModal\')" style="flex:1;">撤销申请</button>';
            html += '<button class="btn" style="flex:1;background:#059669;color:white;font-size:12px;border-radius:4px;padding:6px;" onclick="simulateApprove()">模拟：审核通过</button>';
            html += '<button class="btn" style="flex:1;background:#dc2626;color:white;font-size:12px;border-radius:4px;padding:6px;" onclick="simulateReject()">模拟：审核不通过</button>';
            html += '</div>';
            html += '</div>';
            document.getElementById('pageContent').innerHTML = html;
        }

        function renderModifyReviewPage() {
            var d = pendingHouseData;
            var html = '';
            html += '<div class="section-card">';
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">';
            html += '<div class="section-title" style="margin-bottom:0;">修改审核中</div>';
            html += '<span class="status-badge badge-pending">审核中</span>';
            html += '</div>';

            html += '<div class="house-info-display">';
            var a = authenticatedHouseData;
            html += '<div style="font-size:12px;color:#059669;font-weight:500;margin-bottom:10px;">当前认证信息</div>';
            html += '<div class="house-info-row"><span class="house-info-label">小区</span><span class="house-info-value">' + a.community + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">期数</span><span class="house-info-value">' + a.phase + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">楼栋</span><span class="house-info-value">' + a.building + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">单元</span><span class="house-info-value">' + a.unit + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">层数</span><span class="house-info-value">' + a.floor + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">房号</span><span class="house-info-value">' + a.room + '</span></div>';
            html += '</div>';

            html += '<div class="house-info-display" style="border-color:#fef3c7;background:#fffbeb;margin-top:14px;">';
            html += '<div style="font-size:12px;color:#d97706;font-weight:500;margin-bottom:10px;">修改申请待审核</div>';
            html += '<div class="house-info-row"><span class="house-info-label">小区</span><span class="house-info-value">' + d.community + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">期数</span><span class="house-info-value">' + d.phase + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">楼栋</span><span class="house-info-value">' + d.building + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">单元</span><span class="house-info-value">' + d.unit + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">层数</span><span class="house-info-value">' + d.floor + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">房号</span><span class="house-info-value">' + d.room + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">住户姓名</span><span class="house-info-value">' + (d.residentName || '未填写') + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">备注</span><span class="house-info-value">' + (d.note || '无') + '</span></div>';
            html += '</div>';

            html += '<div style="margin-top:14px;display:flex;gap:10px;">';
            html += '<button class="btn btn-outline btn-sm" onclick="openModal(\'cancelReviewModal\')" style="flex:1;">撤销申请</button>';
            html += '<button class="btn" style="flex:1;background:#059669;color:white;font-size:12px;border-radius:4px;padding:6px;" onclick="simulateModifyApprove()">模拟：审核通过</button>';
            html += '<button class="btn" style="flex:1;background:#dc2626;color:white;font-size:12px;border-radius:4px;padding:6px;" onclick="simulateModifyReject()">模拟：审核不通过</button>';
            html += '</div>';
            html += '</div>';
            document.getElementById('pageContent').innerHTML = html;
        }

        function simulateApprove() {
            authenticatedHouseData = JSON.parse(JSON.stringify(pendingHouseData));
            pendingHouseData = null;
            currentState = 'authenticated';
            renderAuthenticatedPage();
            showToast('审核已通过！');
        }

        function simulateModifyApprove() {
            authenticatedHouseData = JSON.parse(JSON.stringify(pendingHouseData));
            pendingHouseData = null;
            currentState = 'authenticated';
            pickerValues = JSON.parse(JSON.stringify(authenticatedHouseData));
            renderAuthenticatedPage();
            showToast('修改审核已通过！');
        }

        function simulateReject() {
            currentState = 'rejected';
            renderRejectedPage();
            showToast('审核被驳回');
        }

        function simulateModifyReject() {
            currentState = 'modify_rejected';
            renderModifyRejectedPage();
            showToast('修改审核被驳回');
        }

        function renderRejectedPage() {
            var d = pendingHouseData;
            var html = '';
            html += '<div class="section-card">';
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">';
            html += '<div class="section-title" style="margin-bottom:0;">认证审核未通过</div>';
            html += '<span class="status-badge badge-reject">未通过</span>';
            html += '</div>';

            html += '<div class="section-subtitle" style="margin-bottom:14px;">审核未通过原因：信息不匹配，请检查填写的房屋信息是否正确后重新提交。</div>';

            html += '<div class="house-info-display" style="border-color:#fecaca;background:#fff5f5;">';
            html += '<div class="house-info-row"><span class="house-info-label">小区</span><span class="house-info-value">' + d.community + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">期数</span><span class="house-info-value">' + d.phase + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">楼栋</span><span class="house-info-value">' + d.building + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">单元</span><span class="house-info-value">' + d.unit + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">层数</span><span class="house-info-value">' + d.floor + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">房号</span><span class="house-info-value">' + d.room + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">住户姓名</span><span class="house-info-value">' + (d.residentName || '未填写') + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">备注</span><span class="house-info-value">' + (d.note || '无') + '</span></div>';
            html += '</div>';

            html += '<div style="margin-top:14px;display:flex;gap:10px;">';
            html += '<button class="btn btn-outline btn-sm" onclick="openModal(\'cancelReviewModal\')" style="flex:1;">撤销申请</button>';
            html += '<button class="btn btn-primary btn-sm" onclick="resubmitAfterReject()" style="flex:1;">重新提交</button>';
            html += '</div>';
            html += '</div>';
            document.getElementById('pageContent').innerHTML = html;
        }

        function renderModifyRejectedPage() {
            var d = pendingHouseData;
            var html = '';
            html += '<div class="section-card">';
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">';
            html += '<div class="section-title" style="margin-bottom:0;">修改审核未通过</div>';
            html += '<span class="status-badge badge-reject">未通过</span>';
            html += '</div>';

            html += '<div class="section-subtitle" style="margin-bottom:14px;">审核未通过原因：提交的房屋信息与实际不符，请核对后重新提交。</div>';

            html += '<div class="house-info-display">';
            var a = authenticatedHouseData;
            html += '<div style="font-size:12px;color:#059669;font-weight:500;margin-bottom:10px;">当前认证信息</div>';
            html += '<div class="house-info-row"><span class="house-info-label">小区</span><span class="house-info-value">' + a.community + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">期数</span><span class="house-info-value">' + a.phase + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">楼栋</span><span class="house-info-value">' + a.building + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">单元</span><span class="house-info-value">' + a.unit + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">层数</span><span class="house-info-value">' + a.floor + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">房号</span><span class="house-info-value">' + a.room + '</span></div>';
            html += '</div>';

            html += '<div class="house-info-display" style="border-color:#fecaca;background:#fff5f5;margin-top:14px;">';
            html += '<div style="font-size:12px;color:#dc2626;font-weight:500;margin-bottom:10px;">未通过的修改申请</div> ';
            html += '<div class="house-info-row"><span class="house-info-label">小区</span><span class="house-info-value">' + d.community + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">期数</span><span class="house-info-value">' + d.phase + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">楼栋</span><span class="house-info-value">' + d.building + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">单元</span><span class="house-info-value">' + d.unit + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">层数</span><span class="house-info-value">' + d.floor + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">房号</span><span class="house-info-value">' + d.room + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">住户姓名</span><span class="house-info-value">' + (d.residentName || '未填写') + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">备注</span><span class="house-info-value">' + (d.note || '无') + '</span></div>';
            html += '</div>';

            html += '<div style="margin-top:14px;display:flex;gap:10px;">';
            html += '<button class="btn btn-outline btn-sm" onclick="openModal(\'cancelReviewModal\')" style="flex:1;">撤销申请</button>';
            html += '<button class="btn btn-primary btn-sm" onclick="resubmitModifyAfterReject()" style="flex:1;">重新提交</button>';
            html += '</div>';
            html += '</div>';
            document.getElementById('pageContent').innerHTML = html;
        }

        function resubmitAfterReject() {
            pickerValues = JSON.parse(JSON.stringify(pendingHouseData));
            currentState = 'modifying';
            renderAuthPage(true);
        }

        function resubmitModifyAfterReject() {
            pickerValues = JSON.parse(JSON.stringify(pendingHouseData));
            currentState = 'modifying';
            renderAuthPage(true);
        }

        function confirmCancelReview() {
            pendingHouseData = null;
            closeModal('cancelReviewModal');
            if (authenticatedHouseData) {
                currentState = 'authenticated';
                pickerValues = JSON.parse(JSON.stringify(authenticatedHouseData));
                renderAuthenticatedPage();
                showToast('已撤销修改申请');
            } else {
                currentState = 'unauthenticated';
                pickerValues = {
                    community: '',
                    phase: '',
                    building: '',
                    unit: '',
                    floor: '',
                    room: '',
                    residentName: '',
                    note: ''
                };
                renderAuthPage(false);
                showToast('已撤销审核申请');
            }
        }

        function renderAuthenticatedPage() {
            var d = authenticatedHouseData;
            var tab = window._memberTab || 'members';
            var html = '';

            html += '<div class="section-card">';
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">';
            html += '<div><div class="section-title" style="margin-bottom:0;">已认证房屋</div></div>';
            html += '<span class="status-badge badge-success">已认证</span>';
            html += '</div>';

            html += '<div class="house-info-display">';
            html += '<div class="house-info-row"><span class="house-info-label">小区</span><span class="house-info-value">' + d.community + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">期数</span><span class="house-info-value">' + d.phase + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">楼栋</span><span class="house-info-value">' + d.building + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">单元</span><span class="house-info-value">' + d.unit + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">层数</span><span class="house-info-value">' + d.floor + '</span></div>';
            html += '<div class="house-info-row"><span class="house-info-label">房号</span><span class="house-info-value">' + d.room + '</span></div>';
            html += '</div>';

            html += '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">';
            html += '<button class="btn btn-warning btn-sm" onclick="startModify()">修改认证</button>';
            html += '<button class="btn btn-danger btn-sm" onclick="openModal(\'unbindModal\')">解绑房屋</button>';
            html += '</div>';
            html += '</div>';

            html += '<div class="tabs">';
            html += '<button class="tab-item' + (tab === 'members' ? ' active' : '') + '" onclick="switchMemberTab(\'members\')">同住成员</button>';
            html += '<button class="tab-item' + (tab === 'gold' ? ' active' : '') + '" onclick="switchMemberTab(\'gold\')">物业金</button>';
            html += '</div>';

            if (tab === 'members') {
                html += renderMembersContent();
            } else {
                html += renderGoldContent();
            }

            document.getElementById('pageContent').innerHTML = html;
        }

        function renderMembersContent() {
            var html = '<div class="section-card">';
            html += '<div class="section-title">同住成员</div>';
            html += '<div class="section-subtitle">' + authenticatedHouseData.community + ' ' + authenticatedHouseData.building + ' ' + authenticatedHouseData.room + '</div>';

            for (var i = 0; i < members.length; i++) {
                var m = members[i];
                html += '<div class="member-list-item">';
                html += '<div class="member-avatar">' + m.name[0] + '</div>';
                html += '<div class="member-info"><div class="member-name">' + m.name + '</div><div class="member-role">' + (m.phone || '未绑定手机') + '</div></div>';
                html += '</div>';
            }

            html += '</div>';
            return html;
        }

        function renderGoldContent() {
            var html = '';

            html += '<div class="property-gold-card">';
            html += '<div class="gold-amount" id="goldAmount">¥142.27</div>';
            html += '<div class="gold-label">' + authenticatedHouseData.community + ' ' + authenticatedHouseData.room + ' · 可用物业金</div>';
            html += '</div>';

            html += '<div class="section-card">';
            html += '<div class="section-title">物业金明细</div>';
            html += '<div class="section-subtitle">近30天变动记录</div>';

            for (var i = 0; i < goldDetails.length; i++) {
                var g = goldDetails[i];
                var cls = g.type === 'plus' ? 'gold-plus' : 'gold-minus';
                html += '<div class="gold-detail-item">';
                html += '<div><div>' + g.desc + '</div><div class="gold-detail-time">' + g.time + '</div></div>';
                html += '<div class="gold-detail-amount ' + cls + '">' + g.amount + '</div>';
                html += '</div>';
            }
            html += '</div>';

            return html;
        }

        function switchMemberTab(tab) {
            window._memberTab = tab;
            renderAuthenticatedPage();
        }

        function startModify() {
            currentState = 'modifying';
            pickerValues = JSON.parse(JSON.stringify(authenticatedHouseData));
            renderAuthPage(true);
        }

        function confirmUnbind() {
            closeModal('unbindModal');
            authenticatedHouseData = null;
            currentState = 'unauthenticated';
            pickerValues = {
                community: '',
                phase: '',
                building: '',
                unit: '',
                floor: '',
                room: '',
                note: ''
            };
            window._memberTab = 'members';
            renderAuthPage(false);
            showToast('解绑成功');
        }

        function switchState(state) {
            currentState = state;
            if (state === 'authenticated') {
                pickerValues = JSON.parse(JSON.stringify(authenticatedHouseData));
                renderAuthenticatedPage();
            } else if (state === 'unauthenticated') {
                pickerValues = {
                    community: '',
                    phase: '',
                    building: '',
                    unit: '',
                    floor: '',
                    room: '',
                    note: ''
                };
                renderAuthPage(false);
            }
        }

        function openModal(id) {
            document.getElementById(id).classList.add('show');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('show');
        }

        function showToast(msg) {
            var t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(function() { t.classList.remove('show'); }, 1800);
        }

        document.querySelectorAll('.modal-overlay').forEach(function(m) {
            m.addEventListener('click', function(e) {
                if (e.target === m) closeModal(m.id);
            });
        });

        renderAuthPage(false);
    