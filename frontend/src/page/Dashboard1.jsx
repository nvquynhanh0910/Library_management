import React, { useState, useEffect, useRef } from 'react';
import { mockData } from '../data/mockdata';

const GREEN = '#7DA78C';
const LIGHT_GREEN = '#e8f5ec';

const BarChart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.SoLanMuon));
    const W = 460, H = 200, padL = 36, padB = 40, padT = 16, padR = 16;
    const barW = Math.floor((W - padL - padR) / data.length * 0.55);
    const gap  = Math.floor((W - padL - padR) / data.length);

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H + padB}`} style={{ overflow: 'visible' }}>
            {/* Lưới ngang */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padT + (H - padT) * (1 - ratio);
                return (
                    <g key={i}>
                        <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#eee" strokeWidth="1" />
                        <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#aaa">
                            {Math.round(maxVal * ratio)}
                        </text>
                    </g>
                );
            })}
            {/* Cột */}
            {data.map((d, i) => {
                const barH = ((d.SoLanMuon / maxVal) * (H - padT));
                const x    = padL + i * gap + (gap - barW) / 2;
                const y    = padT + (H - padT) - barH;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={barH}
                            rx="4" fill={GREEN} opacity="0.85" />
                        <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                            fontSize="11" fontWeight="600" fill={GREEN}>
                            {d.SoLanMuon}
                        </text>
                        <text x={x + barW / 2} y={H + padT + 8} textAnchor="middle"
                            fontSize="10" fill="#777"
                            style={{ whiteSpace: 'pre' }}>
                            {d.TenSach.length > 12 ? d.TenSach.slice(0, 11) + '…' : d.TenSach}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

const PieChart = ({ data }) => {
    const total = data.reduce((s, d) => s + d.SoLanMuon, 0);
    let startAngle = -Math.PI / 2;
    const cx = 100, cy = 100, r = 80;

    const slices = data.map(d => {
        const angle = (d.SoLanMuon / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        startAngle += angle;
        const x2 = cx + r * Math.cos(startAngle);
        const y2 = cy + r * Math.sin(startAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`, color: d.color, label: d.TenTheLoai, val: d.SoLanMuon, pct: Math.round(d.SoLanMuon / total * 100) };
    });

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />)}
                <circle cx={cx} cy={cy} r="38" fill="white" />
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#333">{total}</text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#888">lượt mượn</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {slices.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '3px', background: s.color, flexShrink: 0 }} />
                        <span style={{ color: '#555' }}>{s.label}</span>
                        <span style={{ fontWeight: '700', color: '#333', marginLeft: 'auto' }}>{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart = ({ data }) => {
    const W = 460, H = 160, padL = 36, padB = 28, padT = 16, padR = 16;
    const maxVal = Math.max(...data.map(d => Math.max(d.muon, d.tra))) + 5;
    const toX = i => padL + i * (W - padL - padR) / (data.length - 1);
    const toY = v => padT + (H - padT) * (1 - v / maxVal);

    const lineD = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d[key])}`).join(' ');

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H + padB}`} style={{ overflow: 'visible' }}>
            {[0, 0.5, 1].map((r, i) => (
                <line key={i} x1={padL} y1={toY(maxVal * r)} x2={W - padR} y2={toY(maxVal * r)}
                    stroke="#eee" strokeWidth="1" />
            ))}
            <path d={lineD('muon')} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinejoin="round" />
            <path d={lineD('tra')}  fill="none" stroke="#f0ad4e" strokeWidth="2.5" strokeLinejoin="round" />
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={toX(i)} cy={toY(d.muon)} r="4" fill={GREEN} />
                    <circle cx={toX(i)} cy={toY(d.tra)}  r="4" fill="#f0ad4e" />
                    <text x={toX(i)} y={H + padB - 4} textAnchor="middle" fontSize="11" fill="#888">{d.thang}</text>
                </g>
            ))}
        </svg>
    );
};

const StatCard = ({ icon, label, value, sub, color = GREEN }) => (
    <div style={{
        background: 'white', borderRadius: '10px', padding: '20px 24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${color}`,
        display: 'flex', alignItems: 'center', gap: '16px'
    }}>
        <div style={{
            width: 48, height: 48, borderRadius: '12px',
            background: color + '1a', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px', flexShrink: 0
        }}>{icon}</div>
        <div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '3px' }}>{label}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#222', lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>{sub}</div>}
        </div>
    </div>
);

const recentBorrows = [
    { maPhieu: 'PM001', hoTen: 'Nguyễn Minh Tuấn', sach: 'Lập trình C...', hanTra: '2025-06-15', trangThai: 'Đang mượn' },
    { maPhieu: 'PM002', hoTen: 'Trần Thị Lan',      sach: 'Cấu trúc DL', hanTra: '2025-06-05', trangThai: 'Đã trả'    },
    { maPhieu: 'PM003', hoTen: 'Lê Văn Minh',       sach: 'Cha giàu...',  hanTra: '2025-05-25', trangThai: 'Quá hạn'   },
    { maPhieu: 'PM004', hoTen: 'Phạm Thị Hoa',      sach: 'React Web',   hanTra: '2025-06-20', trangThai: 'Đang mượn' },
];

const trangThaiStyle = {
    'Đang mượn': { background: '#fff3e0', color: '#e65100' },
    'Đã trả':    { background: '#e8f5e9', color: '#2e7d32' },
    'Quá hạn':   { background: '#ffebee', color: '#c62828' },
};

// ════════════════════════════════════════════════════════════
const Dashboard = ({ user }) => {
    const { dashboard } = mockData;
    const [activeTab, setActiveTab] = useState('bar'); // 'bar' | 'line'

    const cards = [
        { icon: '📚', label: 'Tổng đầu sách',    value: dashboard.tongDauSach,  sub: `${dashboard.tongCuonSach} bản sao`,   color: GREEN       },
        { icon: '🔄', label: 'Đang được mượn',   value: dashboard.dangMuon,     sub: 'cuốn chưa trả',                       color: '#f0ad4e'   },
        { icon: '⚠️', label: 'Quá hạn trả',      value: dashboard.quaHan,       sub: 'cần xử lý ngay',                      color: '#d9534f'   },
        { icon: '👤', label: 'Độc giả',           value: dashboard.tongDocGia,   sub: `${dashboard.tongNhanVien} nhân viên` , color: '#5bc0de'   },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── Tiêu đề ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222', fontSize: '20px' }}>📊 Dashboard Thống kê</h2>
                    <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>
                        Tổng quan hoạt động thư viện · Cập nhật hôm nay
                    </p>
                </div>
                <span style={{ fontSize: '12px', color: '#aaa' }}>
                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            {/* ── 4 Cards thống kê ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {cards.map((c, i) => <StatCard key={i} {...c} />)}
            </div>

            {/* ── Hàng biểu đồ ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Biểu đồ cột / đường (có tab chuyển đổi) */}
                <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '15px', color: '#333' }}>
                                {activeTab === 'bar' ? '🏆 Top 5 sách được mượn nhiều nhất' : '📈 Xu hướng mượn - trả theo tháng'}
                            </h3>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['bar', 'line'].map(t => (
                                <button key={t} onClick={() => setActiveTab(t)} style={{
                                    padding: '4px 12px', fontSize: '12px', borderRadius: '20px', cursor: 'pointer',
                                    border: '1px solid #ddd',
                                    background: activeTab === t ? GREEN : 'white',
                                    color:      activeTab === t ? 'white' : '#666',
                                    fontWeight: activeTab === t ? '600' : '400',
                                    transition: 'all .2s'
                                }}>
                                    {t === 'bar' ? 'Cột' : 'Đường'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {activeTab === 'bar'
                        ? <BarChart data={dashboard.topSach} />
                        : (
                            <>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '12px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: GREEN, display: 'inline-block' }} />
                                        Mượn
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f0ad4e', display: 'inline-block' }} />
                                        Trả
                                    </span>
                                </div>
                                <LineChart data={dashboard.theoThang} />
                            </>
                        )
                    }
                </div>

                {/* Pie Chart thể loại */}
                <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>🥧 Tỉ lệ mượn theo Thể loại</h3>
                    <PieChart data={dashboard.theoTheLoai} />
                </div>
            </div>

            {/* ── Bảng mượn gần đây ── */}
            <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#333' }}>🕐 Phiếu mượn gần đây</h3>
                    <span style={{ fontSize: '12px', color: GREEN, cursor: 'pointer', fontWeight: '600' }}>Xem tất cả →</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Mã phiếu', 'Độc giả', 'Sách', 'Hạn trả', 'Trạng thái'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#888', fontWeight: '500', borderBottom: '2px solid #f0f0f0' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {recentBorrows.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f7f7f7' }}>
                                <td style={{ padding: '11px 12px', fontSize: '13px' }}><code style={{ background: LIGHT_GREEN, color: GREEN, padding: '2px 6px', borderRadius: '4px' }}>{r.maPhieu}</code></td>
                                <td style={{ padding: '11px 12px', fontSize: '13px', fontWeight: '500' }}>{r.hoTen}</td>
                                <td style={{ padding: '11px 12px', fontSize: '13px', color: '#555' }}>{r.sach}</td>
                                <td style={{ padding: '11px 12px', fontSize: '13px', color: '#777' }}>{r.hanTra}</td>
                                <td style={{ padding: '11px 12px' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...trangThaiStyle[r.trangThai] }}>
                                        {r.trangThai}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
