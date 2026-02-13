export const werewolf = {
  en: {
    "role.villager.name": "Villager",
    "role.villager.desc":
      "A regular townsperson with no special abilities, trying to find the werewolves.",
    "role.werewolf.name": "Werewolf",
    "role.werewolf.desc": "Each night, the werewolves choose a player to kill.",
    "role.seer.name": "Seer",
    "role.seer.desc":
      "Each night, the Seer can check a player to see if they are a werewolf.",
    "role.doctor.name": "Doctor",
    "role.doctor.desc":
      "Each night, the Doctor can choose one player to save from being killed.",
    "role.hunter.name": "Hunter",
    "role.hunter.desc":
      "If the Hunter is killed, they can take one person down with them.",
    "role.cupid.name": "Cupid",
    "role.cupid.desc":
      'On the first night, Cupid chooses two players to be "Lovers". If one dies, the other dies too.',
    "role.witch.name": "Witch",
    "role.witch.desc":
      "The Witch has two potions: one to save and one to kill. They can use each only once per game.",
    "role.werewolf.nightAction": "Choose a player to eliminate.",
    "role.seer.nightAction": "Check if a player is a Werewolf.",
    "role.doctor.nightAction": "Choose a player to protect.",
    "role.cupid.nightAction": "Choose two players to fall in love.",
    "role.witch.nightAction":
      "Decide whether to use the potion of life or death.",
    "role.witch.nightAction.save":
      "Witch: Who would you like to save? (Potion of Life)",
    "role.witch.nightAction.kill":
      "Witch: Who would you like to eliminate? (Potion of Death)",
    "role.hunter.deathShot":
      "Hunter was eliminated! Choose a player to take down.",
    "setup.title": "New Village",
    "setup.subtitle": "Gather your players and assign their fates.",
    "setup.players": "Players",
    "setup.rolePool": "Role Pool",
    "setup.suggestRoles": "Suggest Roles",
    "setup.startGame": "Start Game",
    "setup.back": "Back",
    "setup.players.error.min": "At least 4 players needed for a fun game!",
    "setup.players.placeholder": "Name...",
    "setup.players.add": "Add Player",
    "dashboard.phase.day": "Day",
    "dashboard.phase.night": "Night",
    "dashboard.villageStatus": "Village Status",
    "dashboard.session": "Session",
    "dashboard.alive": "Alive",
    "narrator.night":
      "Everyone, close your eyes. Werewolves, wake up and choose your victim...",
    "narrator.day": "Everyone, wake up. The sun has risen.",
    "dashboard.newGame": "New Game",
    "dashboard.resetConfirm.title": "Reset Game?",
    "dashboard.resetConfirm.desc":
      "Are you sure? This will end the current session and clear all player data. This action cannot be undone.",
    "dashboard.resetConfirm.cancel": "Cancel",
    "dashboard.resetConfirm.confirm": "End Game",
    "dashboard.resetConfirm.keepPlayers": "Reuse players names",
    // Phase step translations
    "phase.step": "Step {current} of {total}",
    "phase.night.sleep": "Everyone, close your eyes…",
    "phase.night.sleep.desc": "The village falls asleep. Night has come.",
    "phase.night.roleWake": "{role}, wake up!",
    "phase.night.wake": "Everyone, open your eyes!",
    "phase.night.wake.desc": "The night is over. Dawn breaks over the village.",
    "phase.day.announce": "Announcing Results",
    "phase.day.announce.desc": "Reveal who was eliminated during the night.",
    "phase.day.hunterShot": "Hunter's Revenge",
    "phase.day.hunterShot.desc":
      "The Hunter takes someone with them to the grave!",
    "phase.day.discuss": "Discussion Time",
    "phase.day.discuss.desc":
      "Discuss findings, share suspicions, and defend yourselves.",
    "phase.day.vote": "Vote to Eliminate",
    "phase.day.vote.desc":
      "Each player votes to eliminate a suspect from the village.",
    "phase.day.result": "Voting Result",
    "phase.day.result.desc":
      "Announce the results of the vote and execute the decision.",
    "phase.next": "Next",
    "phase.prev": "Back",
    "phase.players": "Players",
    "phase.noPlayers": "No players with this role",
    "phase.finishPhase": "Finish {phase}",
    "setup.distribution": "Distribution",
    "setup.random": "Random",
    "setup.manual": "Manual",
    "setup.assignRole": "Assign Role",
    "setup.unassigned": "Unassigned",
    "setup.manualWarning":
      "Manual roles are prioritized. Remaining roles in pool will be distributed randomly.",
    "phase.night.mapping": "Role Mapping",
    "phase.night.mapping.role": "Assigning {role}",
    "phase.night.mapping.desc":
      "Assign the physical cards to players in the app",
    "phase.night.mapping.prompt": "Select players for this role",
    "phase.roleAction.activePlayers": "Active Players",
    "phase.roleAction.targets": "Targets",
    "phase.roleAction.selected": "Selected",
    "phase.night.summary": "Night Summary",
    "phase.night.summary.eliminated": "Eliminated:",
    "phase.night.summary.survived": "Everyone survived!",
    "phase.night.summary.protected": "Protected by Doctor/Witch",
    "phase.night.summary.narrator":
      "Narrator: Announce results and update player status.",
    "role.cupid.lovers": "Lovers",
    "role.witch.potions": "Potions",
    "role.witch.potion.life": "Life",
    "role.witch.potion.death": "Death",

    // Story Vibes
    "story.classic.name": "Classic",
    "story.classic.desc":
      "The traditional werewolf experience in a quiet, cursed village.",
    "story.medieval.name": "Medieval",
    "story.medieval.desc":
      "A dark age of knights and castles where beasts roam.",
    "story.haunted.name": "Haunted",
    "story.haunted.desc":
      "An abandoned ghost town where spirits are not the only threat.",
    "story.pirate.name": "Pirate",
    "story.pirate.desc":
      "A misty cove where smugglers hide and something darker lurks.",
    "story.folklore.name": "Vn Folklore",
    "story.folklore.desc":
      "A mythical Vietnamese village under the light of a blood moon.",

    "setup.storyVibe": "Choose Your Story",
    "setup.storyVibe.subtitle": "Set the atmosphere for your village.",
    "narrator.intro.classic":
      "Welcome to Ravenhollow. The moon is full, and the wolves are hungry...",
    "narrator.night.classic":
      "Night falls on Ravenhollow. The villagers sleep, but the beasts awake...",
    "narrator.day.classic":
      "The sun rises over the quiet village. Who survived the night?",
    "narrator.intro.medieval":
      "Ye find yerself in Ironkeep. The King is dead, and dark magic is afoot.",
    "narrator.night.medieval":
      "Darkness shrouds the castle walls. The ancient evil stirs...",
    "narrator.day.medieval":
      "The horn sounds! The castle gates open to reveal the night's toll.",
    "narrator.intro.haunted":
      "Welcome to Hollowshade. The mist here never lifts, and the dead don't rest.",
    "narrator.night.haunted":
      "The fog thickens. The spirits whisper, and something darker hunts...",
    "narrator.day.haunted":
      "The gray morning light reveals the horrors of the darkness.",
    "narrator.intro.pirate":
      "Welcome to Blacktide Bay! Keep yer gold close and yer cutlass closer.",
    "narrator.night.pirate":
      "The tide rolls in, hiding the screams. The deep sea monsters rise...",
    "narrator.day.pirate":
      "Sun's up, ye scurvy dogs! Let's see who's still kickin'.",
    "narrator.intro.vn_folklore":
      "Welcome to Crescent Moon Village. The banyan tree whispers ancient tales...",
    "narrator.night.vn_folklore":
      "Darkness covers the silent village. A knock echoes in the dead of night...",
    "narrator.day.vn_folklore":
      "The rooster crows, breaking the night. What truth will be revealed?",
  },
  vi: {
    "role.villager.name": "Dân làng",
    "role.villager.desc": "Người dân bình thường, cố gắng tìm ra ma sói.",
    "role.werewolf.name": "Ma Sói",
    "role.werewolf.desc": "Mỗi đêm, ma sói thức dậy và chọn một người để giết.",
    "role.seer.name": "Tiên Tri",
    "role.seer.desc":
      "Mỗi đêm, Tiên Tri có thể soi một người xem có phải là sói không.",
    "role.doctor.name": "Bác Sĩ",
    "role.doctor.desc":
      "Mỗi đêm, Bác Sĩ có thể chọn một người để bảo vệ khỏi bị giết.",
    "role.hunter.name": "Thợ Săn",
    "role.hunter.desc":
      "Nếu Thợ Săn bị giết, họ có thể kéo theo một người khác chết cùng.",
    "role.cupid.name": "Thần Tình Yêu",
    "role.cupid.desc":
      'Vào đêm đầu tiên, Cupid chọn hai người để "Yêu nhau". Nếu một người chết, người kia cũng chết theo.',
    "role.witch.name": "Phù Thủy",
    "role.witch.desc":
      "Phù Thủy có hai bình thuốc: một để cứu và một để giết. Mỗi bình chỉ được dùng một lần.",
    "role.werewolf.nightAction": "Chọn một người để giết.",
    "role.seer.nightAction": "Soi xem một người có phải là Sói không.",
    "role.doctor.nightAction": "Chọn một người để bảo vệ.",
    "role.cupid.nightAction": "Chọn hai người để yêu nhau.",
    "role.witch.nightAction":
      "Quyết định dùng bình thuốc cứu hay bình thuốc giết.",
    "role.witch.nightAction.save":
      "Phù Thủy: Bạn muốn cứu ai? (Bình Sinh Mệnh)",
    "role.witch.nightAction.kill": "Phù Thủy: Bạn muốn giết ai? (Bình Tử Vong)",
    "role.hunter.deathShot": "Thợ Săn đã bị loại! Chọn một người để kéo theo.",
    "setup.title": "Làng Mới",
    "setup.subtitle": "Tập hợp người chơi và phân định số phận.",
    "setup.players": "Người chơi",
    "setup.rolePool": "Kho Vai Trò",
    "setup.suggestRoles": "Gợi ý vai trò",
    "setup.startGame": "Bắt đầu",
    "setup.back": "Quay lại",
    "setup.players.error.min": "Cần ít nhất 4 người chơi!",
    "setup.players.placeholder": "Tên...",
    "setup.players.add": "Thêm",
    "dashboard.phase.day": "Ban Ngày",
    "dashboard.phase.night": "Ban Đêm",
    "dashboard.villageStatus": "Tình trạng Làng",
    "dashboard.session": "Phiên",
    "dashboard.alive": "Còn sống",
    "narrator.night":
      "Tất cả nhắm mắt lại. Ma sói, hãy thức dậy và chọn nạn nhân...",
    "narrator.day": "Tất cả thức dậy đi. Trời đã sáng rồi.",
    "dashboard.newGame": "Trò Chơi Mới",
    "dashboard.resetConfirm.title": "Làm mới Trò chơi?",
    "dashboard.resetConfirm.desc":
      "Bạn có chắc chắn không? Hành động này sẽ kết thúc phiên hiện tại và xóa toàn bộ dữ liệu người chơi.",
    "dashboard.resetConfirm.cancel": "Hủy",
    "dashboard.resetConfirm.confirm": "Kết thúc",
    "dashboard.resetConfirm.keepPlayers": "Giữ lại danh sách người chơi",
    // Phase step translations
    "phase.step": "Bước {current} / {total}",
    "phase.night.sleep": "Mọi người nhắm mắt lại…",
    "phase.night.sleep.desc": "Làng chìm vào giấc ngủ. Đêm đã đến.",
    "phase.night.roleWake": "{role}, thức dậy!",
    "phase.night.wake": "Mọi người mở mắt!",
    "phase.night.wake.desc": "Đêm đã qua. Bình minh ló dạng trên ngôi làng.",
    "phase.day.announce": "Thông Báo Kết Quả",
    "phase.day.announce.desc": "Công bố ai đã bị loại trong đêm.",
    "phase.day.hunterShot": "Thợ Săn Trả Thù",
    "phase.day.hunterShot.desc": "Thợ Săn kéo theo một kẻ khác xuống mồ!",
    "phase.day.discuss": "Thời Gian Thảo Luận",
    "phase.day.discuss.desc":
      "Thảo luận, chia sẻ nghi ngờ và tự bảo vệ bản thân.",
    "phase.day.vote": "Bỏ Phiếu Loại Trừ",
    "phase.day.vote.desc":
      "Mỗi người chơi bỏ phiếu loại một nghi phạm khỏi làng.",
    "phase.day.result": "Kết Quả Bỏ Phiếu",
    "phase.day.result.desc":
      "Công bố kết quả bỏ phiếu và thực hiện quyết định.",
    "phase.next": "Tiếp",
    "phase.prev": "Quay lại",
    "phase.players": "Người chơi",
    "phase.noPlayers": "Không có người chơi với vai trò này",
    "phase.finishPhase": "Kết thúc {phase}",
    "setup.distribution": "Phân phối",
    "setup.random": "Ngẫu nhiên",
    "setup.manual": "Thủ công",
    "setup.assignRole": "Gán vai trò",
    "setup.unassigned": "Chưa gán",
    "setup.manualWarning":
      "Các vai trò được chọn thủ công sẽ được ưu tiên. Các vai trò còn lại trong danh sách sẽ được phân ngẫu nhiên cho những người chơi khác.",
    "phase.night.mapping": "Gán Vai Trò",
    "phase.night.mapping.role": "Gán vai trò {role}",
    "phase.night.mapping.desc":
      "Gán thẻ bài vật lý cho người chơi trong ứng dụng",
    "phase.night.mapping.prompt": "Chọn người chơi cho vai trò này",
    "phase.roleAction.activePlayers": "Người chơi hoạt động",
    "phase.roleAction.targets": "Mục tiêu",
    "phase.roleAction.selected": "Đã chọn",
    "phase.night.summary": "Tổng kết Ban đêm",
    "phase.night.summary.eliminated": "Bị loại:",
    "phase.night.summary.survived": "Mọi người đều sống sót!",
    "phase.night.summary.protected": "Được Bảo vệ / Cứu sống",
    "phase.night.summary.narrator":
      "Quản trò: Thông báo kết quả và cập nhật trạng thái người chơi.",
    "role.cupid.lovers": "Đôi tình nhân",
    "role.witch.potions": "Bình thuốc",
    "role.witch.potion.life": "Cứu sống",
    "role.witch.potion.death": "Giết chết",

    // Story Vibes
    "story.classic.name": "Cổ Điển",
    "story.classic.desc":
      "Trải nghiệm ma sói truyền thống tại một ngôi làng yên tĩnh nhưng bị nguyền rủa.",
    "story.medieval.name": "Trung Cổ",
    "story.medieval.desc":
      "Thời kỳ đen tối của các hiệp sĩ và lâu đài, nơi quái thú lộng hành.",
    "story.haunted.name": "Bị Ám",
    "story.haunted.desc":
      "Một thị trấn ma bỏ hoang nơi những linh hồn không phải là mối đe dọa duy nhất.",
    "story.pirate.name": "Cướp Biển",
    "story.pirate.desc":
      "Một vịnh sương mù nơi những kẻ buôn lậu ẩn náu và thứ gì đó đen tối hơn đang rình rập.",
    "story.folklore.name": "Dân Gian VN",
    "story.folklore.desc":
      "Một ngôi làng Việt Nam huyền bí dưới ánh trăng máu.",

    "setup.storyVibe": "Chọn Cốt Truyện",
    "setup.storyVibe.subtitle": "Tạo không khí cho ngôi làng của bạn.",
    "narrator.intro.classic":
      "Chào mừng đến Ravenhollow. Trăng tròn đã lên, và bầy sói đang đói...",
    "narrator.night.classic":
      "Bóng đêm buông xuống Ravenhollow. Dân làng chìm vào giấc ngủ...",
    "narrator.day.classic":
      "Mặt trời mọc trên ngôi làng yên tĩnh. Ai đã sống sót qua đêm nay?",
    "narrator.intro.medieval":
      "Bạn đang ở Ironkeep. Nhà vua đã băng hà, và ma thuật hắc ám đang trỗi dậy.",
    "narrator.night.medieval":
      "Bóng tối bao trùm tường thành. Ác quỷ cổ xưa đang thức tỉnh...",
    "narrator.day.medieval":
      "Tiếng tù và vang lên! Cổng thành mở ra để lộ kết quả của đêm qua.",
    "narrator.intro.haunted":
      "Chào mừng đến Hollowshade. Sương mù ở đây không bao giờ tan...",
    "narrator.night.haunted":
      "Sương mù dày đặc hơn. Những linh hồn thì thầm...",
    "narrator.day.haunted":
      "Ánh sáng buổi sáng xám xịt hé lộ nỗi kinh hoàng của bóng tối.",
    "narrator.intro.pirate":
      "Chào mừng đến Vịnh Hắc Triều! Giữ chặt vàng và thanh gươm của người.",
    "narrator.night.pirate":
      "Thủy triều cuộn trào, che giấu những tiếng la hét...",
    "narrator.day.pirate":
      "Mặt trời lên rồi, lũ chuột cống! Xem ai còn sống nào.",
    "narrator.intro.vn_folklore":
      "Chào mừng đến Làng Trăng Khuyết. Cây đa đầu làng rì rào kể chuyện...",
    "narrator.night.vn_folklore":
      "Bóng đêm bao trùm không gian tịch mịch. Tiếng gõ cửa vang lên giữa đêm khuya...",
    "narrator.day.vn_folklore":
      "Tiếng gà gáy sáng phá tan màn đêm. Sự thật nào sẽ được phơi bày?",
  },
} as const;
