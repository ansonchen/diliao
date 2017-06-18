import auth from '../utils/auth.js'

function redirectToLogin(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectToDashboard(nextState, replace) {
  if (auth.loggedIn()) {
    replace('/')
  }
}

export default {
  //component: require('../components/App'),
  childRoutes: [
    { path: '/logout',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/Logout'))
        })
      }
    },

    { path: '/course',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/Desk/Course'))
        })
        },
        childRoutes:[
            { path: '/reglist/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Desk/Reg/List'))
                })
              }
          },
          { path: '/regitem/:itemid/:id/:detailid',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../components/Desk/Reg/Item'))
              })
            }
        },
        { path: '/questions',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../components/Desk/Questions'))
              })
            }
        },
        { path: '/about',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../components/Desk/About'))
              })
            }
        },
        { path: '/Book/:id',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Desk/Book'))
            })
          }
      }

        ]
    },


    { onEnter: redirectToDashboard,
      childRoutes: [
        // Unauthenticated routes
        // Redirect to dashboard if user is already logged in
         //未经身份验证的路由
         //如果用户已经登录，重定向到仪表板
        { path: '/login',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Login'))
            })
          }
        }
        // ...
      ]
    },

    { onEnter: redirectToLogin,
      childRoutes: [

        // Protected routes that don't share the dashboard UI
        // 不共享仪表板UI的受保护路由
        { path: '/user/:id',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/User'))
            })
          }
      }
        // ...
      ]
    },

    { path: '/',
      getComponent: (nextState, cb) => {
        // Share the path
        // Dynamically load the correct component
        //共享路径
         //动态加载正确的组件
        if (auth.loggedIn()) {
          return require.ensure([], (require) => {
            cb(null, require('../components/Admin/Index'))
          })
        }

        return require.ensure([], (require) => {
         // cb(null, require('../components/Landing'))
             cb(null, require('../components/Desk/Course'))
        })
      },
      indexRoute: {
        getComponent: (nextState, cb) => {
          // Only load if we're logged in
          //仅当我们登录时才加载
          if (auth.loggedIn()) {
            return require.ensure([], (require) => {
              cb(null, require('../components/Admin/Welcome'))
            })
          }
          return cb()
        }
      },
      childRoutes: [
        { onEnter: redirectToLogin,
          childRoutes: [
            // Protected nested routes for the dashboard
            // 仪表板的受保护嵌套路由
            // { path: '/page2',
            //   getComponent: (nextState, cb) => {
            //     require.ensure([], (require) => {
            //       cb(null, require('../components/PageTwo'))
            //     })
            //   }
            // },
            //规范
            { path: '/norm',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Norm/List'))
                })
              }
            },

            //规范 添加/修改
            { path: '/normadd/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Norm/Add'))
                })
              }
            },
            //报名表
            { path: '/formreg',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Regform/List'))
                })
              }
            },

            //报名表 添加/修改
            { path: '/formregadd/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Regform/Add'))
                })
              }
            },
              //地址
              { path: '/address',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Address/List'))
                })
              }
            },
                //地址 添加/修改
            { path: '/addressadd/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Address/Add'))
                })
              }
            },
             //报名信息
            { path: '/regdbitem/:id',
             getComponent: (nextState, cb) => {
               require.ensure([], (require) => {
                 cb(null, require('../components/Admin/Regitem/List'))
               })
             }
            },
              //地点列表
            { path: '/addressitem/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Addressitem/List'))
                })
              }
            },
              //地点列表 添加/修改
            { path: '/addressitemadd/:pid/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Addressitem/Add'))
                })
              }
            },
              //单一文章修改，关于，问与答
            { path: '/textsignle/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Textsingle/Add'))
                })
              }
          },
              //带分类文章修改
            { path: '/textmore/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Textmore/List'))
                })
              }
            },
              //带分类文章详情 添加/修改
            { path: '/textmoreadd/:pid/:id',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Admin/Textmore/Add'))
                })
              }
            },
            // ...
          ]
        }
      ]
    }

  ]
}
