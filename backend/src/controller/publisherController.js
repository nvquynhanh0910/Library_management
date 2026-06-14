const{Publisher} = require('../models');

const getAllPublishers = async (req, res) => {
    try { res.json(await Publisher.findAll()); }
    catch (err) { res.status(500).json({ message: err.message }); }
};
 
const createPublisher = async (req, res) => {
    try {
        const { MaNXB, TenNXB, DiaChi, SoDienThoai } = req.body;
        if (!MaNXB || !TenNXB)
            return res.status(400).json({ message: 'Thiếu mã hoặc tên NXB' });
        res.status(201).json(await Publisher.create({ MaNXB, TenNXB, DiaChi, SoDienThoai }));
    } catch (err) { res.status(500).json({ message: err.message }); }
};
 
const updatePublisher = async (req, res) => {
    try {
        const p = await Publisher.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'Không tìm thấy NXB' });
        await p.update({ TenNXB: req.body.TenNXB, DiaChi: req.body.DiaChi, SoDienThoai: req.body.SoDienThoai });
        res.json(p);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
 
const deletePublisher = async (req, res) => {
    try {
        const p = await Publisher.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'Không tìm thấy NXB' });
        await p.destroy();
        res.json({ message: 'Xóa NXB thành công' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {getAllPublishers,createPublisher,updatePublisher,deletePublisher};