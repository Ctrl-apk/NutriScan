import Report from '../models/Report.js';

/**
 * @desc    Submit a new unsafe product report
 * @route   POST /api/report
 * @access  Private
 */
export const submitReport = async (req, res) => {
  try {
    const { productName, reason, category, severity } = req.body;

    // Validation
    if (!productName || !reason) {
      return res.status(400).json({ 
        message: 'Product name and reason are required' 
      });
    }

    // Create report
    const report = await Report.create({
      productName,
      reason,
      category: category || 'other',
      severity: severity || 'medium',
      reportedBy: req.user._id,
      reportedByEmail: req.user.email,
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report,
    });
  } catch (error) {
    console.error('Submit Report Error:', error);
    res.status(500).json({ message: 'Server error submitting report' });
  }
};

/**
 * @desc    Get all reports (with filtering)
 * @route   GET /api/report
 * @access  Private
 */
export const getReports = async (req, res) => {
  try {
    const { status, category, severity, limit = 50 } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;

    const reports = await Report.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

/**
 * @desc    Get user's own reports
 * @route   GET /api/report/my-reports
 * @access  Private
 */
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get My Reports Error:', error);
    res.status(500).json({ message: 'Server error fetching your reports' });
  }
};

/**
 * @desc    Upvote a report
 * @route   PUT /api/report/:id/upvote
 * @access  Private
 */
export const upvoteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.upvotes += 1;
    await report.save();

    res.json({
      message: 'Report upvoted',
      upvotes: report.upvotes,
    });
  } catch (error) {
    console.error('Upvote Error:', error);
    res.status(500).json({ message: 'Server error upvoting report' });
  }
};

/**
 * @desc    Delete a report (only by creator)
 * @route   DELETE /api/report/:id
 * @access  Private
 */
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns the report
    if (report.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await report.deleteOne();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({ message: 'Server error deleting report' });
  }
};