import Case from '../models/Case.js';
// @desc    Create new case
// @route   POST /api/cases
// @access  Private (Patient)
export const createCase = async (req, res) => {
    try {
        const newCase = await Case.create({
            ...req.body,
            createdBy: req.user.id,
        });
        res.status(201).json({ success: true, case: newCase });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get all cases
// @route   GET /api/cases
// @access  Public
export const getCases = async (req, res) => {
    try {
        const { status, category, urgent } = req.query;
        let query = {};
        if (status)
            query.verificationStatus = status;
        if (urgent)
            query.isUrgent = urgent === 'true';
        // Add category filter if disease matches or by category list later
        const cases = await Case.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: cases.length, cases });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Public
export const getCase = async (req, res) => {
    try {
        const caseData = await Case.findById(req.params.id).populate('createdBy', 'name email');
        if (!caseData) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }
        res.status(200).json({ success: true, case: caseData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private (Owner/Admin)
export const updateCase = async (req, res) => {
    try {
        let caseData = await Case.findById(req.params.id);
        if (!caseData) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }
        // Check ownership
        if (caseData.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this case' });
        }
        caseData = await Case.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, case: caseData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=caseController.js.map