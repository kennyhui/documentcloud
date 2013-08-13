require 'test_helper'

class CollaboratorsControllerTest < ActionController::TestCase

  test "routing" do
    assert_recognizes(
      { controller: 'collaborators', project_id: '1', action: 'create' },
      { path: '/projects/1/collaborators',  method: :post } )
    assert_recognizes(
      { controller: 'collaborators', project_id: '1', id: '1', action: 'destroy' },
      { path: '/projects/1/collaborators/1',  method: :delete } )
  end

  test "create" do
    login_account!
    project = projects(:collab)
    assert_empty project.collaborations
    post :create, :project_id=>project.id, :email=>accounts(:freelancer_bob).email
    assert_equal 1, project.collaborations.count
  end

  test "destroy" do
    login_account!
    project = projects(:collab)
    user = accounts(:freelancer_bob )
    assert project.add_collaborator( user )
    refute_empty project.collaborations
    delete :destroy, :project_id=>project.id, :id=>user.id
    assert_empty project.collaborations(true)
  end

end
