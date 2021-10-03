const Upgrade = require('../../model/upgrade')
const User = require('../../model/user')
const upgradeConstant = require('../../constant/upgrade')
const userConstant = require('../../constant/user')

const getPagination = (page, limit) => {
  const size = limit ? +limit : 10
  const offset = page ? page * limit : 0
  return { size, offset, }
}

exports.getAllUpgrades = async (req, res) => {
  const { page, limit, } = req.query
  const { size, offset, } = getPagination(page, limit)
  await Upgrade.paginate({}, { offset, size, })
    .then((data) => {
      res.status(200).json({
        code: 1000,
        totalItems: data.totalDocs,
        items: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      })
    })
    .catch(() => {
      res.status(500).send({
        code: -1000,
        message: 'Đã xảy ra một số lỗi khi truy xuất',
      })
    })
}

exports.upgrade = async (req, res) => {
  const { id, } = req.params

  const upgrade = await Upgrade.findOne({ id, })

  if (!upgrade) {
    return res.status(404).json({
      code: -1000,
      message: 'Không tìm thấy yêu cầu này!',
    })
  }

  if (upgrade && upgrade.status === upgradeConstant.UPGRADE_STATUS.REJECT) {
    return res.status(400).json({
      code: -1000,
      message: 'Yêu cầu này đã bị từ chối!',
    })
  }

  if (upgrade && upgrade.expiredDate < Date.now()) {
    await Upgrade.updateOne({ id: upgrade.id, }, { status: upgradeConstant.UPGRADE_STATUS.REJECT, })
    upgrade.status = upgradeConstant.UPGRADE_STATUS.REJECT
    return res.status(400).json({
      code: -1000,
      message: 'Yêu cầu này đã hết hạn!',
    })
  }

  await Upgrade.updateOne({ id: upgrade.id, }, { status: upgradeConstant.UPGRADE_STATUS.APPROVE, })
  const user = await User.findOneAndUpdate({ id: upgrade.userId, }, { role: userConstant.USER_ROLE.SELLER, })
  if (user) {
    res.status(200).json({
      code: 1000,
      message: 'Cập nhật thành công!',
    })
  } else {
    res.status(500).json({
      code: -1000,
      message: 'Đã xảy ra một số lỗi khi truy xuất',
    })
  }
}

exports.downgrade = async (req, res) => {
  const { id, } = req.params

  const user = await User.findOne({ id, })
  if (!user) {
    return res.status(404).json({
      code: -1000,
      message: 'Không tìm thấy người dùng này!',
    })
  }
  if (user && user.role === userConstant.USER_ROLE.BIDDER) {
    return res.status(400).json({
      code: -1000,
      message: 'Người dùng này không thể hạ cấp!',
    })
  }

  await User.updateOne({ id: user.id, }, { role: userConstant.USER_ROLE.BIDDER, })

  res.status(200).json({
    code: 1000,
    message: 'Hạ cấp người dùng thành công!',
  })
}
