import 'dotenv/config'
import passport from 'passport'
import { User } from '../Model/database'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id)

        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      } catch (error) {
        return done(error, false)
      }
    }
  )
)

export default passport
