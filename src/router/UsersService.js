const UsersService = {
    checkUsername(knex, username) {
        return knex.select('username').from('users_table').where('username', username)
    }
}

module.exports = UsersService