import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const G  = '#7DA78C';
const GL = '#e8f5ec';

const BarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.SoLanMuon));
    const W = 440, H = 180, pL = 32, pB = 36, pT = 14, pR = 12;
    const bW = 34;
    const gap = (W - pL - pR) / data.length;
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H + pB}`} style={{ overflow: 'visible' }}>
            {[0, 0.5, 1].map((r, i) => {
                const y = pT + (H - pT) * (1 - r);
                return (
                    <g key={i}>
                        <line x1={pL} y1={y} x2={W - pR} y2={y} stroke="#eee" strokeWidth="1" />
                        <text x={pL - 5} y={y + 4} textAnchor="end" fontSize="10" fill="#bbb">{Math.round(max * r)}</text>
                    </g>
                );
            })}
            {data.map((d, i) => {
                const bH = ((d.SoLanMuon / max) * (H - pT));
                const x  = pL + i * gap + (gap - bW) / 2;
                const y  = pT + (H - pT) - bH;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={bW} height={bH} rx="4" fill={G} opacity="0.85" />
                        <text x={x + bW / 2} y={y - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill={G}>{d.SoLanMuon}</text>
                        <text x={x + bW / 2} y={H + pT + 10} textAnchor="middle" fontSize="10" fill="#999">
                            {d.TenSach.length > 10 ? d.TenSach.slice(0, 9) + '…' : d.TenSach}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

const PieChart = ({ data }) => {
    const total = data.reduce((s, d) => s + d.SoLanMuon, 0);
    let angle = -Math.PI / 2;
    const cx = 90, cy = 90, r = 72;
    const slices = data.map(d => {
        const sweep = (d.SoLanMuon / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        angle += sweep;
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2},${y2}Z`, color: d.color, label: d.TenTheLoai, pct: Math.round(d.SoLanMuon / total * 100) };
    });
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
                {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />)}
                <circle cx={cx} cy={cy} r="36" fill="white" />
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#333">{total}</text>
                <text x={cx} y={cy + 13} textAnchor="middle" fontSize="9" fill="#aaa">lượt mượn</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {slices.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <span style={{ width: 11, height: 11, borderRadius: '3px', background: s.color, flexShrink: 0 }} />
                        <span style={{ color: '#555' }}>{s.label}</span>
                        <span style={{ fontWeight: '700', color: '#333', marginLeft: 'auto', paddingLeft: '10px' }}>{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart = ({ data }) => {
    const W = 440, H = 150, pL = 32, pB = 28, pT = 14, pR = 12;
    const max = Math.max(...data.flatMap(d => [d.muon, d.tra])) + 5;
    const toX = i => pL + i * (W - pL - pR) / (data.length - 1);
    const toY = v => pT + (H - pT) * (1 - v / max);
    const line = key => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d[key])}`).join(' ');
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H + pB}`} style={{ overflow: 'visible' }}>
            {[0, 0.5, 1].map((r, i) => <line key={i} x1={pL} y1={toY(max * r)} x2={W - pR} y2={toY(max * r)} stroke="#eee" strokeWidth="1" />)}
            <path d={line('muon')} fill="none" stroke={G}        strokeWidth="2.5" strokeLinejoin="round" />
            <path d={line('tra')}  fill="none" stroke="#f0ad4e"  strokeWidth="2.5" strokeLinejoin="round" />
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={toX(i)} cy={toY(d.muon)} r="4" fill={G}       />
                    <circle cx={toX(i)} cy={toY(d.tra)}  r="4" fill="#f0ad4e" />
                    <text x={toX(i)} y={H + pB - 2} textAnchor="middle" fontSize="11" fill="#aaa">{d.thang}</text>
                </g>
            ))}
        </svg>
    );
};

const Card = ({ icon, label, value, sub, color }) => (
    <div style={{ background: 'white', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: 46, height: 46, borderRadius: '10px', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#222', lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>{sub}</div>}
        </div>
    </div>
);

const TTStyle = {
    'Đang mượn': { background: '#fff3e0', color: '#e65100' },
    'Đã trả':    { background: '#e8f5e9', color: '#2e7d32' },
    'Quá hạn':   { background: '#ffebee', color: '#c62828' },
};

const Dashboard = ({ user }) => {
    const { dashboard } = mockData;
    const [chartTab, setChartTab] = useState('bar');

    const cards = [
        { icon: '📚', label: 'Tổng đầu sách',  value: dashboard.tongDauSach,  sub: `${dashboard.tongCuonSach} bản sao`,   color: G         },
        { icon: '🔄', label: 'Đang được mượn', value: dashboard.dangMuon,     sub: 'cuốn chưa trả',                       color: '#f0ad4e' },
        { icon: '⚠️', label: 'Quá hạn trả',    value: dashboard.quaHan,       sub: 'cần xử lý ngay',                      color: '#d9534f' },
        { icon: '👤', label: 'Tổng độc giả',   value: dashboard.tongDocGia,   sub: `${dashboard.tongNhanVien} nhân viên`, color: '#5bc0de' },
    ];

    const recent = [
        { ma: 'PM001', ten: 'Nguyễn Minh Tuấn', sach: 'Lập trình C...',   han: '2025-06-15', tt: 'Đang mượn' },
        { ma: 'PM002', ten: 'Trần Thị Lan',      sach: 'Cấu trúc DL',     han: '2025-06-05', tt: 'Đã trả'    },
        { ma: 'PM003', ten: 'Lê Văn Minh',       sach: 'Cha giàu...',     han: '2025-05-25', tt: 'Quá hạn'   },
        { ma: 'PM004', ten: 'Phạm Thị Hoa',      sach: 'React Web',       han: '2025-06-20', tt: 'Đang mượn' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tiêu đề */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#222' }}>📊 Dashboard Thống kê</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#999' }}>Tổng quan hoạt động thư viện · Dữ liệu demo</p>
                </div>
                <span style={{ fontSize: '12px', color: '#bbb' }}>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                {cards.map((c, i) => <Card key={i} {...c} />)}
            </div>

            {/* Biểu đồ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Cột / Đường */}
                <div style={{ background: 'white', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#333' }}>
                            {chartTab === 'bar' ? '🏆 Top 5 sách mượn nhiều nhất' : '📈 Mượn - Trả theo tháng'}
                        </h3>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {[['bar','Cột'],['line','Đường']].map(([k,l]) => (
                                <button key={k} onClick={() => setChartTab(k)} style={{ padding: '3px 10px', fontSize: '12px', borderRadius: '20px', cursor: 'pointer', border: `1px solid ${chartTab===k ? G : '#ddd'}`, background: chartTab===k ? G : 'white', color: chartTab===k ? 'white' : '#777', fontWeight: chartTab===k ? '600' : '400' }}>{l}</button>
                            ))}
                        </div>
                    </div>
                    {chartTab === 'bar' ? <BarChart data={dashboard.topSach} /> : (
                        <>
                            <div style={{ display: 'flex', gap: '14px', marginBottom: '6px', fontSize: '12px' }}>
                                {[[G,'Mượn'],['#f0ad4e','Trả']].map(([c,l]) => (
                                    <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
                                    </span>
                                ))}
                            </div>
                            <LineChart data={dashboard.theoThang} />
                        </>
                    )}
                </div>

                {/* Pie Chart */}
                <div style={{ background: 'white', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ margin: '0 0 14px', fontSize: '14px', color: '#333' }}>🥧 Tỉ lệ mượn theo Thể loại</h3>
                    <PieChart data={dashboard.theoTheLoai} />
                </div>
            </div>

            {/* Bảng phiếu mượn gần đây */}
            <div style={{ background: 'white', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '14px', color: '#333' }}>🕐 Phiếu mượn gần đây</h3>
                <table>
                    <thead>
                        <tr>
                            {['Mã phiếu','Độc giả','Sách','Hạn trả','Trạng thái'].map(h => (
                                <th key={h} style={{ padding: '8px 12px', fontSize: '12px', color: '#999', fontWeight: '500', borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {recent.map((r, i) => (
                            <tr key={i}>
                                <td style={{ padding: '10px 12px' }}><code style={{ background: GL, color: G, padding: '2px 7px', borderRadius: '4px', fontWeight: '600' }}>{r.ma}</code></td>
                                <td style={{ padding: '10px 12px', fontWeight: '500' }}>{r.ten}</td>
                                <td style={{ padding: '10px 12px', color: '#777' }}>{r.sach}</td>
                                <td style={{ padding: '10px 12px', color: '#999' }}>{r.han}</td>
                                <td style={{ padding: '10px 12px' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...TTStyle[r.tt] }}>{r.tt}</span>
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
