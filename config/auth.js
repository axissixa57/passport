module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) { // если пользователь авторизаван, то пропускаем дальше
      return next();
    }

    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) { // если пользователь авторизаван, то даём доступ к странице dashboard
    if (!req.isAuthenticated()) { 
      return next();
    }
    res.redirect('/dashboard');      
  }
};
