import Campaign from "../models/campaignModel.js";
import User from "../models/userModel.js";

const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      progress = 0,
      target = 0,
      timeLeft,
      image,
      urgent = false,
    } = req.body;

    const organiser = req.user.id;
    const campaign = new Campaign({
      title,
      description,
      organiser,
      category,
      progress,
      target,
      timeLeft,
      image,
      urgent,
    });

    // supporters should reflect number of attendees
    campaign.supporters = (campaign.attendees && campaign.attendees.length) || 0;
    await campaign.save();

  // populate before returning for consistency
  await campaign.populate('organiser', 'username');
  await campaign.populate('attendees', 'username');

    res.status(201).json({ ok: true, campaign });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to create campaign' });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('organiser', 'username').populate('attendees', 'username');
    res.json({ ok: true, campaigns });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch campaigns' });
  }
};

const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('organiser', 'username').populate('attendees', 'username');
    if (!campaign) return res.status(404).json({ ok: false, message: 'Campaign not found' });
    res.json({ ok: true, campaign });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch campaign' });
  }
};

const updateCampaign = async (req, res) => {
  try {
    // Prevent manual override of supporters — it's derived from attendees
    const updates = { ...req.body };
    if (updates.supporters !== undefined) delete updates.supporters;

    const campaign = await Campaign.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!campaign) return res.status(404).json({ ok: false, message: 'Campaign not found' });

    // recompute supporters based on attendees
    campaign.supporters = (campaign.attendees && campaign.attendees.length) || 0;
    await campaign.save();

  await campaign.populate('organiser', 'username');
  await campaign.populate('attendees', 'username');

  res.json({ ok: true, campaign });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to update campaign' });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ ok: false, message: 'Campaign not found' });
    res.json({ ok: true, message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to delete campaign' });
  }
};

const joinCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    // try to add the user only if not already present (atomic)
    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, attendees: { $ne: userId } },
      { $addToSet: { attendees: userId } },
      { new: true }
    );

    if (!campaign) {
      // check if campaign exists
      const exists = await Campaign.findById(id);
      if (!exists) return res.status(404).json({ ok: false, message: 'Campaign not found' });
      return res.status(400).json({ ok: false, message: 'Already joined' });
    }

  // recompute supporters and persist
  campaign.supporters = (campaign.attendees && campaign.attendees.length) || 0;
  await campaign.save();

  await campaign.populate('organiser', 'username');
  await campaign.populate('attendees', 'username');

  res.json({ ok: true, campaign });
  } catch (err) {
    console.error('joinCampaign error', err);
    res.status(500).json({ ok: false, message: 'Failed to join campaign' });
  }
};

const leaveCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    // atomically remove the user if present
    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, attendees: { $in: [userId] } },
      { $pull: { attendees: userId } },
      { new: true }
    );

    if (!campaign) {
      const exists = await Campaign.findById(id);
      if (!exists) return res.status(404).json({ ok: false, message: 'Campaign not found' });
      return res.status(400).json({ ok: false, message: 'Not a member' });
    }

  campaign.supporters = (campaign.attendees && campaign.attendees.length) || 0;
  await campaign.save();

  await campaign.populate('organiser', 'username');
  await campaign.populate('attendees', 'username');

  res.json({ ok: true, campaign });
  } catch (err) {
    console.error('leaveCampaign error', err);
    res.status(500).json({ ok: false, message: 'Failed to leave campaign' });
  }
};

export { createCampaign, getCampaigns, getCampaign, updateCampaign, deleteCampaign, joinCampaign, leaveCampaign };
