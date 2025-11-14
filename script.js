document.addEventListener('DOMContentLoaded', function() {
    // 多语言配置
    const translations = {
        'zh-CN': {
            title: 'Chastity / Orgasms Calendar',
            prevMonth: '上一月',
            nextMonth: '下一月',
            exportData: '导出数据',
            importData: '导入数据',
            exportDataTitle: '导出数据 (Ctrl+Shift+E)',
            importDataTitle: '导入数据 (Ctrl+Shift+I)',
            statusLegend: '状态说明',
            locked: '锁定',
            unlocked: '解锁',
            lockedRuined: '锁定 - 毁灭高潮',
            lockedOrgasm: '锁定 - 高潮',
            unlockedRuined: '解锁 - 毁灭高潮',
            unlockedOrgasm: '解锁 - 高潮',
            clearStatus: '清除状态',
            overallStats: '总体统计',
            lockedDays: '锁定天数:',
            unlockedDays: '解锁天数:',
            ruinedCount: '破坏高潮次数:',
            orgasmCount: '高潮次数:',
            monthlyStats: '当月统计',
            trends: '趋势分析',
            maxLockedStreak: '最长锁定连续天数:',
            currentLockedStreak: '当前锁定连续天数:',
            totalDaysRecorded: '数据记录天数:',
            selectDateStatus: '选择日期状态',
            statusUpdated: '状态已更新！',
            clickDateToSetStatus: '点击日期单元格可以设置状态',
            dataExportSuccess: '数据导出成功！',
            dataImportSuccess: '数据导入成功！',
            dataImportError: '导入的文件格式不正确！',
            dataImportFailed: '导入数据失败：',
            createdFooter: 'Created By AI - Powered By Tail',
            weekDays: ['日', '一', '二', '三', '四', '五', '六'],
            monthYearFormat: (year, month) => `${year}年${month}月`,
            dateFormat: (year, month, day) => `${year}年${parseInt(month)}月${parseInt(day)}日`
        },
        'en-US': {
            title: 'Chastity / Orgasms Calendar',
            prevMonth: '‹ Previous',
            nextMonth: 'Next ›',
            exportData: 'Export Data',
            importData: 'Import Data',
            exportDataTitle: 'Export Data (Ctrl+Shift+E)',
            importDataTitle: 'Import Data (Ctrl+Shift+I)',
            statusLegend: 'Status Legend',
            locked: 'Locked',
            unlocked: 'Unlocked',
            lockedRuined: 'Locked - Ruined Orgasm',
            lockedOrgasm: 'Locked - Orgasm',
            unlockedRuined: 'Unlocked - Ruined Orgasm',
            unlockedOrgasm: 'Unlocked - Orgasm',
            clearStatus: 'Clear Status',
            overallStats: 'Overall Statistics',
            lockedDays: 'Locked Days:',
            unlockedDays: 'Unlocked Days:',
            ruinedCount: 'Ruined Orgasms:',
            orgasmCount: 'Orgasms:',
            monthlyStats: 'Monthly Statistics',
            trends: 'Trend Analysis',
            maxLockedStreak: 'Longest Lock Streak:',
            currentLockedStreak: 'Current Lock Streak:',
            totalDaysRecorded: 'Days Recorded:',
            selectDateStatus: 'Select Date Status',
            statusUpdated: 'Status updated!',
            clickDateToSetStatus: 'Click date cells to set status',
            dataExportSuccess: 'Data exported successfully!',
            dataImportSuccess: 'Data imported successfully!',
            dataImportError: 'Imported file format is incorrect!',
            dataImportFailed: 'Data import failed:',
            createdFooter: 'Created By AI - Powered By Tail',
            weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthYearFormat: (year, month) => `${month} ${year}`,
            dateFormat: (year, month, day) => `${month} ${parseInt(day)}, ${year}`
        }
    };

    // 当前语言设置
    let currentLanguage = localStorage.getItem('selectedLanguage') || 'zh-CN';

    // 获取DOM元素
    const calendar = document.getElementById('calendar');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const statusModal = document.getElementById('status-modal');
    const modalDate = document.getElementById('modal-date');
    const closeButton = document.querySelector('.close-button');
    const statusButtons = document.querySelectorAll('.status-btn');
    
    // 统计元素
    const lockedDaysCount = document.getElementById('locked-days');
    const unlockedDaysCount = document.getElementById('unlocked-days');
    const ruinedCount = document.getElementById('ruined-count');
    const orgasmCount = document.getElementById('orgasm-count');
    
    // 月度统计元素
    const monthlyLockedDaysCount = document.getElementById('monthly-locked-days');
    const monthlyUnlockedDaysCount = document.getElementById('monthly-unlocked-days');
    const monthlyRuinedCount = document.getElementById('monthly-ruined-count');
    const monthlyOrgasmCount = document.getElementById('monthly-orgasm-count');
    
    // 趋势分析元素
    const maxLockedStreak = document.getElementById('max-locked-streak');
    const currentLockedStreak = document.getElementById('current-locked-streak');
    const totalDaysRecorded = document.getElementById('total-days-recorded');
    
    // 当前日期设置
    let currentDate = new Date();
    let selectedDate = null;
    
    // 从本地存储加载数据
    let calendarData = JSON.parse(localStorage.getItem('chastityCalendarData')) || {};
    
    // 更新页面语言函数
    function updateLanguage(lang) {
        const t = translations[lang];
        
        // 更新HTML lang属性
        document.documentElement.lang = lang;
        
        // 更新标题
        document.title = t.title;
        document.querySelector('h1').textContent = t.title;
        
        // 更新按钮文本
        prevMonthBtn.innerHTML = `‹ ${t.prevMonth}`;
        nextMonthBtn.innerHTML = `${t.nextMonth} ›`;
        document.getElementById('export-data').textContent = t.exportData;
        document.getElementById('export-data').title = t.exportDataTitle;
        document.getElementById('import-data').textContent = t.importData;
        document.getElementById('import-data').title = t.importDataTitle;
        
        // 更新图例文本
        document.querySelector('.legend h3').textContent = t.statusLegend;
        const legendItems = document.querySelectorAll('.legend-item span');
        const statusOrder = ['locked', 'unlocked', 'locked-ruined', 'locked-orgasm', 'unlocked-ruined', 'unlocked-orgasm'];
        const statusTexts = [t.locked, t.unlocked, t.lockedRuined, t.lockedOrgasm, t.unlockedRuined, t.unlockedOrgasm];
        
        legendItems.forEach((item, index) => {
            if (statusOrder[index]) {
                item.textContent = statusTexts[index];
            }
        });
        
        // 更新统计文本
        document.querySelector('.statistics h3').textContent = t.overallStats;
        document.querySelector('.monthly-statistics h3').textContent = t.monthlyStats;
        document.querySelector('.trends h3').textContent = t.trends;
        
        const statLabels = document.querySelectorAll('.stat-label');
        statLabels[0].textContent = t.lockedDays;
        statLabels[1].textContent = t.unlockedDays;
        statLabels[2].textContent = t.ruinedCount;
        statLabels[3].textContent = t.orgasmCount;
        
        const monthlyStatLabels = document.querySelectorAll('.monthly-statistics .stat-label');
        monthlyStatLabels[0].textContent = t.lockedDays;
        monthlyStatLabels[1].textContent = t.unlockedDays;
        monthlyStatLabels[2].textContent = t.ruinedCount;
        monthlyStatLabels[3].textContent = t.orgasmCount;
        
        const trendLabels = document.querySelectorAll('.trend-label');
        trendLabels[0].textContent = t.maxLockedStreak;
        trendLabels[1].textContent = t.currentLockedStreak;
        trendLabels[2].textContent = t.totalDaysRecorded;
        
        // 更新模态框文本
        document.querySelector('#modal-date').previousElementSibling.textContent = t.selectDateStatus;
        
        // 更新状态按钮文本
        const statusBtnTexts = [t.locked, t.unlocked, t.lockedRuined, t.lockedOrgasm, t.unlockedRuined, t.unlockedOrgasm, t.clearStatus];
        statusButtons.forEach((button, index) => {
            if (statusBtnTexts[index]) {
                button.textContent = statusBtnTexts[index];
            }
        });
        
        // 更新页脚
        document.querySelector('.footer p').textContent = t.createdFooter;
        
        // 重新渲染日历以更新星期和日期格式
        renderCalendar();
    }
    
    // 切换语言函数
    function switchLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        updateLanguage(lang);
        
        // 更新语言按钮的激活状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 激活当前语言按钮
        const activeBtn = document.querySelector(`.lang-btn[onclick="switchLanguage('${lang}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    // 暴露语言切换函数到全局
    window.switchLanguage = switchLanguage;
    
    // 初始化语言
    updateLanguage(currentLanguage);
    
    // 添加数据导入/导出功能支持
    document.addEventListener('keydown', function(event) {
        // Ctrl+Shift+E 导出数据
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            exportData();
        }
        // Ctrl+Shift+I 导入数据
        if (event.ctrlKey && event.shiftKey && event.key === 'I') {
            importData();
        }
    });
    
    // 初始化日历
    renderCalendar();
    updateAllStatistics();
    
    // 事件监听器
    prevMonthBtn.addEventListener('click', goToPrevMonth);
    nextMonthBtn.addEventListener('click', goToNextMonth);
    closeButton.addEventListener('click', closeModal);
    
    // 点击状态按钮设置日期状态
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (selectedDate) {
                const status = this.classList.contains('clear') ? null : 
                              Array.from(this.classList).find(cls => 
                                  cls !== 'status-btn' && cls !== 'clear');
                
                if (status === null) {
                    delete calendarData[selectedDate];
                } else {
                    calendarData[selectedDate] = status;
                }
                
                // 保存到本地存储
                localStorage.setItem('chastityCalendarData', JSON.stringify(calendarData));
                
                // 更新日历和统计
                        renderCalendar();
                        updateAllStatistics();
                        
                        // 显示操作成功提示
                        const t = translations[currentLanguage];
                        showTooltip(document.querySelector('#calendar'), t.statusUpdated);
                closeModal();
            }
        });
    });
    
    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(event) {
        if (event.target === statusModal) {
            closeModal();
        }
    });
    
    // 添加提示信息
    function showTooltip(element, message) {
        // 创建提示元素
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '1001';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        
        document.body.appendChild(tooltip);
        
        // 计算位置
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.pageXOffset + rect.width / 2}px`;
        tooltip.style.top = `${rect.top + window.pageYOffset - 30}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        // 显示提示
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        // 3秒后移除
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 300);
        }, 3000);
    }
    
    // 在页面加载时显示简要使用说明
    setTimeout(() => {
        const legend = document.querySelector('.legend');
        const t = translations[currentLanguage];
        showTooltip(legend, t.clickDateToSetStatus);
    }, 1000);
    
    // 渲染日历函数
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const t = translations[currentLanguage];
        
        // 更新标题
        currentMonthYear.textContent = t.monthYearFormat(year, month + 1);
        
        // 清空日历
        calendar.innerHTML = '';
        
        // 创建表头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const days = t.weekDays;
        
        days.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        calendar.appendChild(thead);
        
        // 创建表体
        const tbody = document.createElement('tbody');
        
        // 获取当月第一天
        const firstDay = new Date(year, month, 1);
        // 获取当月最后一天
        const lastDay = new Date(year, month + 1, 0);
        
        // 获取当月第一天是星期几
        const firstDayIndex = firstDay.getDay();
        // 获取当月的天数
        const daysInMonth = lastDay.getDate();
        
        // 获取上个月的最后几天
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // 创建日期单元格
        let dayCount = 1;
        let nextMonthDayCount = 1;
        
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                
                // 上个月的日期
                if (i === 0 && j < firstDayIndex) {
                    const prevMonthDay = prevMonthLastDay - firstDayIndex + j + 1;
                    cell.textContent = prevMonthDay;
                    cell.classList.add('other-month');
                    
                    // 为上个月的日期设置日期字符串用于查询数据
                    const prevMonth = month - 1 < 0 ? 11 : month - 1;
                    const prevYear = month - 1 < 0 ? year - 1 : year;
                    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevMonthDay).padStart(2, '0')}`;
                    
                    if (calendarData[dateStr]) {
                        cell.classList.add(calendarData[dateStr]);
                    }
                }
                // 当月的日期
                else if (dayCount <= daysInMonth) {
                    cell.textContent = dayCount;
                    
                    // 为当前月的日期设置日期字符串用于查询数据和点击事件
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
                    
                    if (calendarData[dateStr]) {
                        cell.classList.add(calendarData[dateStr]);
                    }
                    
                    // 添加点击事件
                    cell.addEventListener('click', function() {
                        openModal(dateStr);
                    });
                    
                    // 添加键盘事件支持
                    cell.setAttribute('tabindex', '0');
                    cell.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openModal(dateStr);
                        }
                    });
                    
                    dayCount++;
                }
                // 下个月的日期
                else {
                    cell.textContent = nextMonthDayCount;
                    cell.classList.add('other-month');
                    
                    // 为下个月的日期设置日期字符串用于查询数据
                    const nextMonth = month + 1 > 11 ? 0 : month + 1;
                    const nextYear = month + 1 > 11 ? year + 1 : year;
                    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextMonthDayCount).padStart(2, '0')}`;
                    
                    if (calendarData[dateStr]) {
                        cell.classList.add(calendarData[dateStr]);
                    }
                    
                    nextMonthDayCount++;
                }
                
                row.appendChild(cell);
            }
            
            tbody.appendChild(row);
            
            // 如果已经渲染了当月所有日期，则退出循环
            if (dayCount > daysInMonth && nextMonthDayCount > 1) {
                break;
            }
        }
        
        calendar.appendChild(tbody);
    }
    
    // 切换到上个月
    function goToPrevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        updateMonthlyStatistics();
    }
    
    // 切换到下个月
    function goToNextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        updateMonthlyStatistics();
    }
    
    // 打开模态框
    function openModal(dateStr) {
        selectedDate = dateStr;
        const t = translations[currentLanguage];
        
        // 格式化日期显示
        const [year, month, day] = dateStr.split('-');
        modalDate.textContent = t.dateFormat(year, month, day);
        
        // 显示模态框（带动画）
        statusModal.classList.add('show');
        
        // 设置焦点到第一个状态按钮
        setTimeout(() => {
            const firstButton = statusModal.querySelector('.status-btn');
            if (firstButton) firstButton.focus();
        }, 10);
    }
    
    // 关闭模态框
    function closeModal() {
        statusModal.classList.remove('show');
        // 延迟清除选中状态，等待动画完成
        setTimeout(() => {
            selectedDate = null;
        }, 300);
    }
    
    // 更新所有统计数据
    function updateAllStatistics() {
        updateStatistics();
        updateMonthlyStatistics();
        calculateLockedStreaks();
    }
    
    // 更新总体统计数据
    function updateStatistics() {
        let locked = 0;
        let unlocked = 0;
        let ruined = 0;
        let orgasm = 0;
        
        Object.values(calendarData).forEach(status => {
            if (status.includes('locked')) {
                locked++;
            }
            if (status.includes('unlocked')) {
                unlocked++;
            }
            if (status.includes('ruined')) {
                ruined++;
            }
            if (status.includes('orgasm')) {
                orgasm++;
            }
        });
        
        lockedDaysCount.textContent = locked;
        unlockedDaysCount.textContent = unlocked;
        ruinedCount.textContent = ruined;
        orgasmCount.textContent = orgasm;
        
        // 更新记录天数
        totalDaysRecorded.textContent = Object.keys(calendarData).length;
    }
    
    // 更新月度统计数据
    function updateMonthlyStatistics() {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const monthPrefix = `${year}-${month}-`;
        
        let locked = 0;
        let unlocked = 0;
        let ruined = 0;
        let orgasm = 0;
        
        Object.entries(calendarData).forEach(([date, status]) => {
            if (date.startsWith(monthPrefix)) {
                if (status.includes('locked')) {
                    locked++;
                }
                if (status.includes('unlocked')) {
                    unlocked++;
                }
                if (status.includes('ruined')) {
                    ruined++;
                }
                if (status.includes('orgasm')) {
                    orgasm++;
                }
            }
        });
        
        monthlyLockedDaysCount.textContent = locked;
        monthlyUnlockedDaysCount.textContent = unlocked;
        monthlyRuinedCount.textContent = ruined;
        monthlyOrgasmCount.textContent = orgasm;
    }
    
    // 计算连续锁定天数
    function calculateLockedStreaks() {
        if (Object.keys(calendarData).length === 0) {
            maxLockedStreak.textContent = '0';
            currentLockedStreak.textContent = '0';
            return;
        }
        
        // 将日期字符串转换为Date对象并排序
        const sortedDates = Object.keys(calendarData)
            .filter(date => calendarData[date].includes('locked'))
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => a - b);
        
        if (sortedDates.length === 0) {
            maxLockedStreak.textContent = '0';
            currentLockedStreak.textContent = '0';
            return;
        }
        
        // 计算最长连续天数
        let maxStreak = 1;
        let tempStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const prevDay = new Date(sortedDates[i - 1]);
            const currentDay = new Date(sortedDates[i]);
            
            // 检查是否是连续的一天
            const diffTime = currentDay - prevDay;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
                maxStreak = Math.max(maxStreak, tempStreak);
            } else {
                tempStreak = 1;
            }
        }
        
        // 计算当前连续天数 - 必须从今天开始连续
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let currentStreak = 0;
        let checkDate = new Date(today);
        
        // 如果今天没有锁定，当前连续天数直接为0
        if (!calendarData[today.toISOString().split('T')[0]] || !calendarData[today.toISOString().split('T')[0]].includes('locked')) {
            currentStreak = 0;
        } else {
            // 从今天开始向前检查连续锁定天数
            while (calendarData[checkDate.toISOString().split('T')[0]] && 
                   calendarData[checkDate.toISOString().split('T')[0]].includes('locked')) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }
        
        // 如果今天没有锁定，检查最近的连续锁定天数
        if (currentStreak === 0 && sortedDates.length > 0) {
            // 获取最近的锁定日期
            const lastLockedDate = sortedDates[sortedDates.length - 1];
            currentStreak = 1; // 至少有一天
            checkDate = new Date(lastLockedDate);
            
            // 向前查找连续的锁定日期
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                const dateStr = checkDate.toISOString().split('T')[0];
                
                if (calendarData[dateStr] && calendarData[dateStr].includes('locked')) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }
        maxLockedStreak.textContent = maxStreak;
        currentLockedStreak.textContent = currentStreak;
    }
    
    // 导出数据功能 - 暴露到window对象供HTML按钮调用
    window.exportData = function() {
        const dataStr = JSON.stringify(calendarData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `chastity-calendar-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    // 导入数据功能 - 暴露到window对象供HTML按钮调用
    window.importData = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        // 验证导入的数据格式
                        if (typeof importedData === 'object') {
                            calendarData = importedData;
                        localStorage.setItem('chastityCalendarData', JSON.stringify(calendarData));
                        renderCalendar();
                        updateAllStatistics();
                        const t = translations[currentLanguage];
                        alert(t.dataImportSuccess);
                        } else {
                            const t = translations[currentLanguage];
                            alert(t.dataImportError);
                        }
                    } catch (error) {
                        const t = translations[currentLanguage];
                        alert(t.dataImportFailed + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    };
    
    // 添加键盘事件支持
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && statusModal.style.display === 'block') {
            closeModal();
        }
    });
    
    // 为了确保在小屏幕上的可用性，添加触摸事件支持
    if ('ontouchstart' in window) {
        document.querySelectorAll('#calendar td').forEach(cell => {
            // 使用触摸事件委托而不是直接绑定
            cell.addEventListener('touchstart', function(e) {
                // 只阻止非当月日期的默认行为
                if (!this.classList.contains('other-month')) {
                    e.preventDefault(); // 防止默认行为
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const day = String(this.textContent).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    openModal(dateStr);
                }
            });
            
            // 添加触摸反馈
            cell.addEventListener('touchend', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    }
    
    // 添加窗口大小改变时的响应式调整
    window.addEventListener('resize', function() {
        // 重新渲染日历以适应新的窗口大小
        renderCalendar();
    });
});